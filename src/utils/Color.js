(function(Gear, Constants) {

	var _currentR = 0,
		_currentG = 0,
		_currentB = 0,
		_maxPossibleColors = Math.pow(255, 3);
		
	/**
	 * Everytime a color is retrieved from the sequence
	 * b is incremented. When be rolls over 255, it resets to 0
	 * and increments g. Same with g to r. If r rolls over 255,
	 * the sequence is reset to 0, 0, 0.
	 *
	 * This is more performance than getRandom
	 * @return {Object} rgb values
	 */
	var _generateSequentialColor = function() {
		var r = _currentR,
			g = _currentG,
			b = _currentB;

		b += 1;
		if (b > 255) {
			b = 0;
			g += 1;
		}

		if (g > 255) {
			g = 0;
			r += 1;
		}

		if (r > 255) {
			r = 0;
		}

		_currentR = r;
		_currentG = g;
		_currentB = b;

		return {
			r: r,
			g: g,
			b: b
		};
	};

	Gear.Color = {
		/**
		 * Get a hex string from a color (#000000)
		 * @param  {String|Object} color
		 * @return {String} hex (#000000)
		 */
		toHex: function(color) {
			// hex
			if (color[0] === '#') { return color; }

			// color string
			if (color in Constants.COLOR) {
				rgb = Constants.COLOR[color];
				return ('#' + this.rgbToHex(rgb[0], rgb[1], rgb[2]));
			}

			return ('#' + this.rgbToHex(this.toRGB(color)));
		},

		/**
		 * Get the RGB components of a color
		 * @param  {String} color
		 * @return {Object}
		 * @example: each of the following examples return {r:0, g:0, b:255}
		 * var rgb = Gear.Color.toRGB('blue');
		 * var rgb = Gear.Color.toRGB('#0000ff');
		 * var rgb = Gear.Color.toRGB('rgb(0,0,255)');
		 */
		toRGB: function(color) {
			var rgb;

			if (_.isObject(color)) {
				return color;
			}

			// color string
			if (color in Constants.COLOR) {
				rgb = Constants.COLOR[color];
				return {
					r: rgb[0],
					g: rgb[1],
					b: rgb[2]
				};
			}

			if (color[0] === '#') { // hex
				return this.hexToRgb(color.substring(1));
			}

			if (color.substr(0, 4) === 'rgb(') {
				// rgb string
				rgb = Constants.REGEX.RGB.exec(color.replace(Constants.REGEX.SPACE,''));
				return {
					r: +(rgb[1]),
					g: +(rgb[2]),
					b: +(rgb[3])
				};
			}

			return {
				r: 0,
				g: 0,
				b: 0
			};
		},

		/**
		 * Get a random hex color
		 * @return {String} hex value (#000000)
		 */
		getRandom: function() {
			var randColor = (Math.random() * 0xFFFFFF << 0).toString(16);
			
			while (randColor.length < 6) {
				randColor = '0' + randColor;
			}

			return '#' + randColor;
		},

		/**
		 * Get a random color unique to colors in Gearl.Global.shapes.
		 * Used for creating a unique shape hit to quick-test hit boxes
		 * @return {String} hex value (#000000)
		 */
		getUnique: function() {
	        var shapes = Gear.Global.shapes,
				idx = _maxPossibleColors,
	            rgb, color;
	        
	        while (idx--) {
				rgb = _generateSequentialColor();
				color = this.rgbToHex(rgb.r, rgb.g, rgb.b);
	            if (color && !(color in shapes)) {
	                break;
	            }
	        }

	        if (color === undefined) {
				throw new Error('Cannot generate color id for shape. More than '+ _maxPossibleColors + ' shapes are in use.');
	        }

	        return color;
	    },

	    /**
	     * Turn rgbs into a hex string
	     * @param  {Number} r
	     * @param  {Number} g
	     * @param  {Number} b
	     * @return {String} hex value (000000)
	     */
		rgbToHex: function(r, g, b) {
			return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		},

		/**
		 * Turn a hex string into an rgb object
		 * @param  {String} hex (#000000)
		 * @return {Object}
		 */
		hexToRgb: function(hex) {
			hex = (hex || '').replace('#', '');
			var bigInt = parseInt(hex, 16);
			return {
				r: (bigInt >> 16) & 255,
				g: (bigInt >> 8) & 255,
				b: bigInt & 255
			};
		},
	};

}(Gear, Gear.Constants));