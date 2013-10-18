(function(Gear, Constants, Util) {

	/**
	 * Lines are straight segments defined by an array of points
	 * @param {Object} config
	 * @param {Array} config.points an array of points
	 * @example
	 * var line = new Gear.Line({
	 *		points: [
	 *			{ x: 73, y: 70 },
	 *			{ x: 340, y: 23 },
	 *			{ x: 450, y: 60 },
	 *			{ x: 500, y: 20 }
	 *		],
	 *		stroke: 'blue',
	 *		strokeWidth: 3
	 *	});
	 */
	var Line = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.LINE;
	};

	Line.extend = Util.extend;

	Util.construct(Line.prototype, Gear.Shape.prototype, {
		draw: function(canvas) {
			var points = this.getPoints(),
				firstPoint = points[0],
				context = canvas.getContext();

			context.beginPath();
			context.moveTo(firstPoint.x, firstPoint.y);

			var idx = 1, length = points.length,
				point;
			for (; idx < length; idx += 1) {
				point = points[idx];
				context.lineTo(point.x, point.y);
			}

			var stroke = this.getStroke();
			if (!stroke) { return; }
			stroke.draw(canvas, this);
		},

		getPoints: function() {
			return this.attr.points || (this.attr.points = []);
		},
		setPoints: function(val) {
			this.attr.points = Gear.point.getPoints(val);
		},
		addPoint: function(point) {
			var currentPoints = this.attr.points;
			point = Gear.point.parse(point);

			currentPoints.push(point);
			this.setPoints(currentPoints);
		},

		toString: function() {
			return '[Line]';
		}
	});
	
	Gear.Line = Line;

}(Gear, Gear.Constants, Gear.Util));
