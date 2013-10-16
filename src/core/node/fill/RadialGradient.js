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

		this._start = Gear.point.parse(config.start);
		this._startRadius = config.startRadius || RadialGradient.defaults.startRadius;
		this._end = Gear.point.parse(config.end);
		this._endRadius = config.endRadius || RadialGradient.defaults.endRadius;
		this._colorStops = this._buildColorStops(config.colorStops);
	};

	RadialGradient.defaults = {
		startRadius: 0,
		endRadius: 0
	};

	_.extend(RadialGradient.prototype, Fill.prototype, {
		draw: function(canvase) {
			if (!this.isEnabled()) { return; }

			var context = canvas.getContext(),
				grad = context.createRadialGradient(this._start.x, this._start.y, this._startRadius, this._end.x, endthis._.y, this._endRadius);

			this._applyColorStops(grad, colorStops);

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
		},

		toJSON: function() {
			return {
				start: this._start,
				startRadius: this._startRadius,
				end: this._end,
				endRadius: this._endRadius,
				colorStops: this._colorStops
			};
		},

		toString: function() {
			return '[Fill RadialGradient]';
		}
	});

	Fill.RadialGradient = RadialGradient;

}(Gear, Gear.Fill));
