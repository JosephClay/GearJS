(function(Gear, Constants, Util) {

	/**
	 * An image
	 * @param {Object} config
	 * @param {ImageObject} config.image an Image object
	 * @param {Object} config.crop optional crop area
	 * @example
	 * var imageObj = new Image();
	 * imageObj.onload = function() {
	 *   var image = new Image({
	 *     x: 200,
	 *     y: 50,
	 *     image: imageObj,
	 *     width: 100,
	 *     height: 100
	 *   });
	 * };
	 * imageObj.src = '/path/to/image.jpg'
	 */
	var Image = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.IMAGE;
		this._isFilterApplied = false;
		this.filterCanvas = null;
	};

	_.extend(Image.prototype, Gear.Shape.prototype, {
		
		draw: function(canvas) {
			var context = canvas.getContext(),
				width = this.getWidth(),
				height = this.getHeight(),
				crop = this.getCrop();

			// If a filter is set, and the filter needs to be applied, reapply
			if (!this._isFilterApplied && this.getFilter()) {
				this.filterCanvas = this.applyFilter();
				this._isFilterApplied = true;
			}

			var image = (this.filterCanvas) ? this.filterCanvas.getElement() : this.getImage();

			context.beginPath();
			context.rect(0, 0, width, height);
			context.closePath();
			canvas.fillAndStroke(this);
			
			if (!image) { return; }

			// TODO: Optimize
			var params = this.drawImageParams;
			if (crop.width && crop.height) { // if cropping
				params = [image, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height];
			} else { // no cropping
				params = [image, 0, 0, width, height];
			}

			context.drawImage.apply(context, params);
		},

		hit: function(canvas) {
			var width = this.getWidth(),
				height = this.getHeight(),
				imageHitRegion = this.imageHitRegion,
				context = canvas.getContext();

			if (imageHitRegion) {
				context.drawImage(imageHitRegion, 0, 0, width, height);
				context.beginPath();
				context.rect(0, 0, width, height);
				context.closePath();
				canvas.stroke(this);
				return;
			}

			context.beginPath();
			context.rect(0, 0, width, height);
			context.closePath();
			canvas.fillAndStroke(this);
		},

		applyFilter: function() {
			var image = this.getImage(),
				width = this.getWidth(),
				height = this.getHeight(),
				filter = this.getFilter(),
				filterCanvas, context, imageData;

			if (this.filterCanvas) {
				filterCanvas = this.filterCanvas;
				filterCanvas.clear();
			} else {
				filterCanvas = new Gear.SceneCanvas({
					width: width,
					height: height,
					pixelRatio: 1
				});
			}

			context = filterCanvas.getContext();

			context.drawImage.apply(context, [image, 0, 0, filterCanvas.getWidth(), filterCanvas.getHeight()]);
			imageData = context.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
			filter.call(this, imageData);
			context.putImageData(imageData, 0, 0);

			return filterCanvas;
		},
		clearFilter: function() {
			this.filterCanvas = null;
			this._isFilterApplied = false;
		},

		/**
		 * Create an image hit region which enables more accurate hit
		 * detection mapping of the image by avoiding event detections
		 * for transparent pixels
		 */
		createImageHitRegion: function() {
			var width = this.getWidth(),
				height = this.getHeight(),
				canvas = new Gear.Canvas({
					width: width,
					height: height
				}),
				context = canvas.getContext(),
				image = this.getImage();

			context.drawImage(image, 0, 0);

			var imageData = context.getImageData(0, 0, width, height).
				data = imageData.data,
				rgbColorKey = _.hexToRgb(this.getColorId());

			// replace non transparent pixels with color key
			var idx = 0, length = data.length;
			for (; idx < length; idx += 4) {
				if (data[idx + 3] > 0) {
					data[idx] = rgbColorKey.r;
					data[idx + 1] = rgbColorKey.g;
					data[idx + 2] = rgbColorKey.b;
				}
			}

			var self = this;
			Util.getImage(imageData, function(imageObj) {
				self.imageHitRegion = imageObj;
			});
		},
		clearImageHitRegion: function() {
			this.imageHitRegion = null;
		},

		getWidth: function() {
			var image = this.getImage();
			return _.exists(this.attr.width) ? this.attr.width : (image ? image.width : 0);
		},
		getHeight: function() {
			var image = this.getImage();
			return _.exists(this.attr.height) ? this.attr.height : (image ? image.height : 0);
		},

		getFilter: function() {
			return this.attr.filter;
		},
		setFilter: function(filter) {
			this.attr.filter = filter;
			this._isFilterApplied = false;
		},

		getImage: function() {
			return this.attr.image;
		},
		setImage: function(image) {
			this.attr.image = image;
			return this;
		},

		getCrop: function() {
			var crop = this.attr.crop || (this.attr.crop = {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			});
			return crop;
		},
		setCrop: function(plane) {
			if (!plane) { return; }

			var crop = this.getCrop();

			if (_.exists(plane.x)) { crop.x = plane.x; }
			if (_.exists(plane.y)) { crop.y = plane.y; }
			if (_.exists(plane.width)) { crop.width = plane.width; }
			if (_.exists(plane.height)) { crop.height = plane.height; }
		},

		toString: function() {
			return '[Image]';
		}
	});

	Gear.Image = Image;

}(Gear, Gear.Constants, Gear.Util));


