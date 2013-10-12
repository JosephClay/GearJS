(function(Gear, Fill) {
	
	/**
	 * Radial Gradient
	 * @param  {Object} config
	 * @param  {Point} config.start
	 * @param  {Number} config.startRadius
	 * @param  {Point} config.end
	 * @param  {Number} config.endRadius
	 * @param  {Array} config.colorStops array of { pos, color }
	 * @example
	 * var gradient = new Gear.Fill.LinearGradient({
	 * 		start: { x: 0, y: 0 },
	 * 		startRadius: 0,
	 * 		end: { x: 0, y: 0 },
	 * 		endRadius: 0,
	 * 		colorStops: [
	 * 			{ pos: 0, color: 'black '},
	 * 			{ pos: 50, color: 'white '}
	 * 		]
	 * });
	 */
	var RadialGradient = function(config) {
		Fill.call(this, config);

		this._start = Gear.Point.parse(config.start);
		this._startRadius = config.startRadius || 0;
		this._end = Gear.Point.parse(config.end);
		this._endRadius = config.endRadius || 0;
		this._colorStops = this._buildColorStops(config.colorStops);
	};

	_.extend(RadialGradient.prototype, Fill.prototype, {
		fill: function(canvase) {
			if (!this.isEnabled()) { return; }

			var context = canvas.getContext(),
				grad = context.createRadialGradient(this._start.x, this._start.y, this._startRadius, this._end.x, endthis._.y, this._endRadius);

			this._applyColorStops(grad, colorStops);

			context.fillStyle = grad;
			context.fill();
		},

		// TODO: This is duplicated in LinearGradient - generalize
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

	Fill.RadialGradient = RadialGradient;

}(Gear, Gear.Fill));
