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
		draw: function(canvas) {
			var context = canvas.getContext();
			context.fillStyle = this._color;
			context.fill();
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