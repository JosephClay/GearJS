(function(Gear, Util, Fill) {
	
	/**
	 * Color fill
	 * @param  {String} color
	 * var colorFill = new Gear.Fill.Color({
	 * 		fill: 'black'
	 * });
	 */
	var Color = function(color) {
		Fill.call(this, {});
		this._color = color;
	};

	Util.construct(Color.prototype, Fill.prototype, {
		draw: function(canvas, shape) {
			var context = canvas.getContext();
			context.fillStyle = this._color;

			// For shapes, only fill() if it's not text
			// otherwise, we'll fill other shapes in the context
			if (shape.nodeType !== Gear.Const.NODE_TYPE.TEXT) {
				context.fill();
			}
		},

		toJSON: function() {
			return this._color;
		},

		toString: function() {
			return '[Fill Color]';
		}
	});

	Fill.Color = Color;

}(Gear, Gear.Util, Gear.Fill));