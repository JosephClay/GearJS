(function(Gear, Fill) {
	
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

	_.extend(Color.prototype, Fill.prototype, {
		fill: function(canvas) {
			var context = canvas.getContext();
			context.fillStyle = this._color;
			context.fill();
		}
	});

	Fill.Color = Color;

}(Gear, Gear.Fill));