(function(Gear, Constants) {

	/**
	 * @param {Object} config
	 * @param {Integer} config.numPoints
	 * @param {Number} config.innerRadius
	 * @param {Number} config.outerRadius
	 * @example
	 * var star = new Star({
	 *   x: 100,
	 *   y: 200,
	 *   numPoints: 5,
	 *   innerRadius: 70,
	 *   outerRadius: 70,
	 *   fill: 'red',
	 *   stroke: 'black',
	 *   strokeWidth: 4
	 * });
	 */
	var Star = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.STAR;
	};

	_.extend(Star.prototype, Gear.Shape.prototype, {
		draw: function(canvas) {
			var context = canvas.getContext(),
				innerRadius = this.attr.innerRadius,
				outerRadius = this.attr.outerRadius,
				numPoints = this.attr.numPoints;

			context.beginPath();
			context.moveTo(0, 0 - this.attr.outerRadius);

			var idx = 1, length = numPoints * 2,
				radius, x, y;
			for (; idx < length; idx += 1) {
				radius = (idx % 2 === 0) ? outerRadius : innerRadius;
				x = radius * Math.sin(idx * Math.PI / numPoints);
				y = -1 * radius * Math.cos(idx * Math.PI / numPoints);
				context.lineTo(x, y);
			}

			context.closePath();
			canvas.fillAndStroke(this);
		},

		getNumPoints: function() {
			var val = this.attr.numPoints;
			return (!_.exists(val)) ? 0 : val;
		},
		setNumPoints: function(val) {
			this.attr.numPoints = val;
		},

		getInnerRadius: function() {
			var val = this.attr.innerRadius;
			return (!_.exists(val)) ? 0 : val;
		},
		setInnerRadius: function(val) {
			this.attr.innerRadius = val;
		},

		getOuterRadius: function() {
			var val = this.attr.outerRadius;
			return (!_.exists(val)) ? 0 : val;
		},
		setOuterRadius: function(val) {
			this.attr.outerRadius = val;
		}

	});

	Gear.Star = Star;

}(Gear, Gear.Constants));
