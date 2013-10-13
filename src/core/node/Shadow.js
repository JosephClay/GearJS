(function(Gear) {

	var Shadow = function(config) {
		this._isEnabled = _.isBoolean(config.isEnabled) ? config.isEnabled : true;
		this._color = config.color || Shadow.defaults.color;
		this._blur = config.blur || Shadow.defaults.blur;
		this._opacity = config.opacity || Shadow.defaults.opacity;
		this._offset = config.offset || _.extend({}, Shadow.defaults.offset);
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

			if (opacity) {
				context.globalAlpha = (opacity * shape.getAbsoluteOpacity());
			}

			context.shadowColor = this._color;
			context.shadowBlur = this._blur;
			context.shadowOffsetX = this._offset.x;
			context.shadowOffsetY = this._offset.y;
		},

		isEnabled: function() {
			return this._isEnabled && (this._width > 0);
		},
		enable: function() {
			this._isEnabled = true;
		},
		disable: function() {
			this._isEnabled = false;
		},

		/**
		 * Color get set
		 * @return {[type]} [description]
		 */
		getColor: function() {
			return this._color;
		},
		setColor: function(color) {
			this._color = color;
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