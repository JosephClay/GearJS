(function(Gear, Util, Fill) {
	
	/**
	 * Pattern
	 * @param {Object} config
	 * @param {Image} config.image
	 * @param {String} config.repeat optional see Pattern.REPEAT
	 * @param {Number} config.x optional
	 * @param {Number} config.y optional
	 * @param {Number} config.rotate optional
	 * @param {Point} config.scale optional
	 * @param {Point} config.offset optional
	 * @example
	 * var pattern = new Gear.Fill.Pattern({
	 * 		image: new Image(),
	 * 		repeat: 'repeat-x'
	 * });
	 */
	var Pattern = function(config) {
		Fill.call(this, config);

		this._image = config.image;
		this._repeat = config.repeat || Pattern.defaults.repeat;
		this._x = config.x || Pattern.defaults.x;
		this._y = config.y || Pattern.defaults.y;
		this._scale = config.scale || _.extend({}, Pattern.defaults.scale);
		this._offset = config.offset || _.extend({}, Pattern.defaults.offset);
		this._rotate = config.rotate || Pattern.defaults.rotate;
	};

	Pattern.REPEAT = {
		repeat: 'repeat',
		repeatX: 'repeat-x',
		repeatY: 'repeat-y',
		noRepeat: 'no-repeat'
	};

	Pattern.defaults = {
		x: 0,
		y: 0,
		rotate: 0,
		scale: { x: 1, y: 1 },
		offset: { x: 0, y: 0 },
		repeat: Pattern.REPEAT.repeat
	};

	Util.construct(Pattern.prototype, Fill.prototype, {
		draw: function(canvas) {
			if (!this.isEnabled()) { return; }

			var context = canvas.getContext(),
				x = this._x,
				y = this._y,
				rotate = this._rotate,
				scaleX = this._scale.x,
				scaleY = this._scale.y,
				offsetX = this._offset.x,
				offsetY = this._offset.y;

			if (x !== 0 || y !== 0) {
				context.translate(x, y);
			}
			if (rotate !== 0) {
				context.rotate(Gear.Math.degToRad(rotate));
			}
			if (scaleX !== 1 || scaleY !== 1) {
				context.scale(scaleX, scaleY);
			}
			if (offsetX !== 0 || offsetY !== 0) {
				context.translate(offsetX * -1, offsetY * -1);
			}

			context.fillStyle = context.createPattern(this._image, this._repeat);
			context.fill();
		},

		toJSON: function() {
			return {
				image: this._image.src,
				repeat: this._repeat,
				x: this._x,
				y: this._y,
				scale: this._scale,
				offset: this._offset,
				rotate: this._rotate
			};
		},

		toString: function() {
			return '[Fill Pattern]';
		}
	});

	Fill.Pattern = Pattern;

}(Gear, Gear.Util, Gear.Fill));