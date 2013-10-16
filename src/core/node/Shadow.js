(function(Gear) {

	var Shadow = function(config) {
		this._isEnabled = _.isBoolean(config.isEnabled) ? config.isEnabled : true;
		this._color = config.color || Shadow.defaults.color;
		this._blur = config.blur || Shadow.defaults.blur;
		this._opacity = config.opacity || Shadow.defaults.opacity;
		this._offset = config.offset || _.extend({}, Shadow.defaults.offset);
		this._isInset = _.isBoolean(config.inset) ? config.inset : false;
	};

	Shadow.defaults = {
		color: '#000000',
		blur: 3,
		opacity: 0.5,
		offset: { x: 0, y: 0 }
	};

	Shadow.prototype = {
		draw: function(canvas, shape) {
			if (!this.isEnabled()) { return; }

			var context = canvas.getContext(),
				opacity = this._opacity;

			if (opacity > 0 && opacity < 1) {
				context.globalAlpha = (opacity * shape.getAbsoluteOpacity());
			}
			
			context.shadowColor = this._color;
			context.shadowBlur = this._blur;
			context.shadowOffsetX = this._offset.x;
			context.shadowOffsetY = this._offset.y;
		},

		isEnabled: function() {
			return this._isEnabled;
		},
		enable: function() {
			this._isEnabled = true;
		},
		disable: function() {
			this._isEnabled = false;
		},

		isInset: function() {
			return this._isInset;
		},

		/**
		 * Color get set
		 */
		getColor: function() {
			return this._color;
		},
		setColor: function(color) {
			this._color = color;
			return this;
		},

		/**
		 * Blur get set
		 */
		getBlur: function() {
			return this._blur;
		},
		setBlur: function(blur) {
			this._blur = blur;
			return this;
		},

		/**
		 * Opacity get set
		 */
		getOpacity: function() {
			return this._opacity;
		},
		setOpacity: function(opacity) {
			this._opacity = opacity;
			return this;
		},

		/**
		 * Offset get set
		 */
		getOffset: function() {
			return this._offset;
		},
		setOffset: function(offset) {
			this._offset = offset;
			return this;
		},

		toJSON: function() {
			return {
				isEnabled: this._isEnabled,
				color: this._color,
				blur: this._blur,
				opacity: this._opacity,
				offset: this._offset
			};
		},

		toString: function() {
			return '[Shadow]';
		}
	};

	Gear.Shadow = Shadow;

}(Gear));