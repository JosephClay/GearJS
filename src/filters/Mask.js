(function(Filters) {

	var _pixelAt = function(imgData, x, y) {
		var idx = (y * imgData.width + x) * 4;
		return [imgData.data[idx++], imgData.data[idx++], imgData.data[idx++], imgData.data[idx++]];
	};

	var _rgbDistance = function(p1, p2) {
		return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
	};

	var _rgbMean = function(pTab) {
		var m = [0, 0, 0],
			idx = 0, length = pTab.length;
		for (; idx < length; idx += 1) {
			m[0] += pTab[idx][0];
			m[1] += pTab[idx][1];
			m[2] += pTab[idx][2];
		}

		m[0] /= pTab.length;
		m[1] /= pTab.length;
		m[2] /= pTab.length;

		return m;
	};

	var _backgroundMask = function(imgData, threshold) {
		var rgbv_no = _pixelAt(imgData, 0, 0),
			rgbv_ne = _pixelAt(imgData, imgData.width - 1, 0),
			rgbv_so = _pixelAt(imgData, 0, imgData.height - 1),
			rgbv_se = _pixelAt(imgData, imgData.width - 1, imgData.height - 1),
			thres = threshold || 10;
			
		if (_rgbDistance(rgbv_no, rgbv_ne) < thres &&
			_rgbDistance(rgbv_ne, rgbv_se) < thres &&
			_rgbDistance(rgbv_se, rgbv_so) < thres &&
			_rgbDistance(rgbv_so, rgbv_no) < thres) {

			var mean = _rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]), // Mean color
				mask = [], // Mask based on color distance
				idx = 0, length = (imgData.width * imgData.height),
				d;
			for (; idx < length; idx += 1) {
				d = _rgbDistance(mean, [imgData.data[idx * 4], imgData.data[idx * 4 + 1], imgData.data[idx * 4 + 2]]);
				mask[idx] = (d < thres) ? 0 : 255;
			}

			return mask;
		}
	};

	var _applyMask = function(imgData, mask) {
		var idx = 0, length = (imgData.width * imgData.height);
		for (; idx < length; idx += 1) {
			imgData.data[4 * idx + 3] = mask[idx];
		}
	};

	var _erodeMask = function(mask, sw, sh) {

		var weights = [1, 1, 1, 1, 0, 1, 1, 1, 1],
			side = Math.round(Math.sqrt(weights.length)),
			halfSide = Math.floor(side / 2),
			maskResult = [],
			y = 0;
		for (; y < sh; y += 1) {
			
			var x = 0;
			for (; x < sw; x += 1) {

				var so = (y * sw + x),
					a = 0,
					cy = 0;
				for (; cy < side; cy += 1) {

					var cx = 0;
					for (; cx < side; cx += 1) {
						var scy = y + cy - halfSide,
							scx = x + cx - halfSide;

						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {

							var srcOff = scy * sw + scx,
								wt = weights[cy * side + cx];

							a += mask[srcOff] * wt;
						}
					}
				}

				maskResult[so] = (a === 255 * 8) ? 255 : 0;
			}
		}

		return maskResult;
	};

	var _dilateMask = function(mask, sw, sh) {

		var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1],
			side = Math.round(Math.sqrt(weights.length)),
			halfSide = Math.floor(side / 2),
			maskResult = [],
			y = 0;
		for (; y < sh; y += 1) {

			var x = 0;
			for (; x < sw; x += 1) {

				var so = (y * sw + x),
					a = 0,
					cy = 0;
				for (; cy < side; cy += 1) {

					var cx = 0
					for (; cx < side; cx += 1) {
						var scy = y + cy - halfSide,
							scx = x + cx - halfSide;

						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {

							var srcOff = scy * sw + scx,
								wt = weights[cy * side + cx];

							a += mask[srcOff] * wt;
						}
					}
				}

				maskResult[so] = (a >= 255 * 4) ? 255 : 0;
			}
		}

		return maskResult;
	};

	var _smoothEdgeMask = function(mask, sw, sh) {

		var weights = [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9],
			side = Math.round(Math.sqrt(weights.length)),
			halfSide = Math.floor(side / 2),
			maskResult = [],
			y = 0;
		for (; y < sh; y += 1) {

			var x = 0;
			for (; x < sw; x += 1) {

				var so = (y * sw + x),
					a = 0,
					cy = 0;
				for (; cy < side; cy += 1) {
			
					for (var cx = 0; cx < side; cx += 1) {

						var scy = y + cy - halfSide,
							scx = x + cx - halfSide;

						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {

							var srcOff = scy * sw + scx,
								wt = weights[cy * side + cx];

							a += mask[srcOff] * wt;
						}
					}
				}

				maskResult[so] = a;
			}
		}

		return maskResult;
	};
	
	// Mask Filter
	// Only crop unicolor background images for instance
	Filters.Mask = function(imgData) {
		// Detect pixels close to the background color
		var threshold = this.getFilterThreshold(),
			mask = _backgroundMask(imgData, threshold);
		
		if (!mask) { return imgData; }

		// Erode
		mask = _erodeMask(mask, imgData.width, imgData.height);

		// Dilate
		mask = _dilateMask(mask, imgData.width, imgData.height);

		// Gradient
		mask = _smoothEdgeMask(mask, imgData.width, imgData.height);

		// Apply mask
		_applyMask(imgData, mask);
		
		// POSSIBILITY: Update hit region function according to mask

		return imgData;
	};

}(Gear.Filters));
