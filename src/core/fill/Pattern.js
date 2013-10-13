(function(Gear, Fill) {
	
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
		this._repeat = config.repeat || Pattern.REPEAT.repeat;
		this._x = config.x || 0;
		this._x = config.y || 0;
		this._scale = config.scale || { x: 1, y: 1 };
		this._offset = config.offset || { x: 0, y: 0 };
		this._rotate = config.rotate || 0;
	};

	_.extend(Pattern.prototype, Fill.prototype, {
		fill: function(canvas) {
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
		}
	});

	Pattern.REPEAT = {
		repeat: 'repeat',
		repeatX: 'repeat-x',
		repeatY: 'repeat-y',
		noRepeat: 'no-repeat'
	};

	Fill.Pattern = Pattern;

}(Gear, Gear.Fill));