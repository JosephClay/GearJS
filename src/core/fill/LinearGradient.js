(function(Gear, Fill) {
	
	/**
	 * Linear Gradient
	 * @param  {Object} config
	 * @param  {Point} config.start
	 * @param  {Point} config.end
	 * @param  {Array} config.colorStops array of { pos, color }
	 * @example
	 * var gradient = new Gear.Fill.LinearGradient({
	 * 		start: { x: 0, y: 0 },
	 * 		end: { x: 50, y: 50 },
	 * 		colorStops: [
	 * 			{ pos: 0, color: 'black '},
	 * 			{ pos: 50, color: 'white '}
	 * 		]
	 * });
	 */
	var LinearGradient = function(config) {
		Fill.call(this, config);

		this._start = Gear.Point.parse(config.start);
		this._end = Gear.Point.parse(config.end);
		this._colorStops = this._buildColorStops(config.colorStops);
	};

	_.extend(LinearGradient.prototype, Fill.prototype, {

		fill: function(canvas) {
			if (!this.isEnabled()) { return; }

			var context = canvas.getContext(),
				grad = context.createLinearGradient(this._start.x, this._start.y, this._end.x, this._end.y);

			this._applyColorStops(grad);

			context.fillStyle = grad;
			context.fill();
		},

		_applyColorStops: function(grad) {
			var colorStops = this._colorStops,
				idx = 0, length = colorStops.length,
				stop;
			for (; idx < length; idx += 1) {
				stop = colorStops[idx];
				grad.addColorStop(stop.pos, stop.color);
			}
		},

		_buildColorStops: function(stops) {
			var colorStops = [],
				idx = 0, length = stops.length,
				stop;
			for (; idx < length; idx += 1) {
				stop = stops[idx];
				colorStops.push({
					pos: +stop.pos,
					color: Gear.Color.toRGB(stop.color)
				});
			}

			return colorStops;
		}

	});

	Fill.LinearGradient = LinearGradient;

}(Gear, Gear.Fill));