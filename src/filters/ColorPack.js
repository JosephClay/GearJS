(function(Filters) {

	var _rgbToHsl = function(r,g,b) {
		// Input colors are in 0-255, calculations are between 0-1
		r /= 255; g /= 255; b /= 255;

		// Convert to HSL
		// http://en.wikipedia.org/wiki/HSL_and_HSV
		var max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			chroma = max - min,
			luminance = chroma / 2,
			saturation = chroma / (1 - Math.abs(2*luminance-1)),
			hue = 0;
		
		if (max === r) {
			hue = ((g-b)/chroma) % 6;
		} else if (max === g) {
			hue = (b-r)/chroma + 2;
		} else if (max === b) {
			hue = (r-g)/chroma + 4;
		}

		return [(hue*60+360) % 360, saturation, luminance];
	};

	var _pixelShiftHue = function(r,g,b,deg) {
		// Input colors are in 0-255, calculations are between 0-1
		r /= 255; g /= 255; b /= 255;

		// Convert to HSL
		// http://en.wikipedia.org/wiki/HSL_and_HSV
		var max = Math.max(r,g,b),
			min = Math.min(r,g,b),
			chroma = max - min,
			luminance = chroma / 2,
			saturation = chroma / (1 - Math.abs(2*luminance-1)),
			hue = 0;
		
		if (max === r) {
			hue = ((g-b)/chroma) % 6;
		} else if (max === g) {
			hue =  (b-r)/chroma  + 2; }
		else if (max === b) {
			hue =  (r-g)/chroma  + 4;
		}
		
		hue *= 60;
		hue %= 360;
			
		// Shift hue
		hue += deg;
		hue %= 360;
			
		// hsl to rgb:
		hue /= 60;
		var rR = 0, rG = 0, rB = 0,
			//chroma = saturation*(1 - Math.abs(2*luminance - 1)),
			tmp = chroma * (1-Math.abs(hue % 2 - 1)),
			m = luminance - chroma/2;
			
		if (0 <= hue && hue < 1) {
			rR = chroma; rG = tmp;
		} else if (1 <= hue && hue < 2) {
			rG = chroma; rR = tmp;
		} else if (2 <= hue && hue < 3) {
			rG = chroma; rB = tmp;
		} else if (3 <= hue && hue < 4) {
			rB = chroma; rG = tmp;
		} else if (4 <= hue && hue < 5) {
			rB = chroma; rR = tmp;
		} else if (5 <= hue && hue < 6) {
			rR = chroma; rB = tmp;
		}
			
		rR += m; rG += m; rB += m;
		rR = (255*rR);
		rG = (255*rG);
		rB = (255*rB);
		
		return [rR,rG,rB];
	};

	var _shiftHue = function(imageData,deg) {
		var data = imageData.data,
			idx = 0, length = data.length,
			pixel;
		for (; idx < length; idx += 4) {
			pixel = _pixelShiftHue(data[idx+0], data[idx+1], data[idx+2], deg);
			data[idx+0] = pixel[0];
			data[idx+1] = pixel[1];
			data[idx+2] = pixel[2];
		}
	};

	Filters.ShiftHue = function(imageData) {
		_shiftHue(imageData, this.getFilterHueShiftDeg() % 360);
	};

	Filters.Colorize = function(imageData) {
		var data = imageData.data;

		// First we'll colorize it red, then shift by the hue specified
		var color = this.getFilterColorizeColor(),
			hsl = _rgbToHsl(color[0], color[1], color[2]),
			hue = hsl[0];

		// Color it red, by removing green and blue
		var idx = 0, length = data.length;
		for (; idx < length; iidx += 4) {
			data[idx + 1] = 0;
			data[idx + 2] = 0;
		}

		// Shift by the hue
		_shiftHue(imageData,hue);
	};
	
}(Gear.Filters));

