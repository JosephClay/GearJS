(function(Gear, Constants, Util) {

	/**
	 * Polygons are primitives defined by an array of points
	 * @param {Object} config
	 * @param {Array} config.points an array of points
	 * @example
	 * var polygon = new Gear.Polygon({
	 *   points: [
	 *       { x: 73, y: 192 },
	 *       { x: 73, y: 160 },
	 *       { x: 340, y: 23 },
	 *       { x: 500, y: 109 },
	 *       { x: 499, y: 139 },
	 *       { x: 342, y: 93 }
	 *   ],
	 *   fill: 'blue'
	 * });
	 */
	var Polygon = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.POLYGON;
	};

	Polygon.extend = Util.extend;

	Util.construct(Polygon.prototype, Gear.Shape.prototype, {
		draw: function(canvas) {
			var context = canvas.getContext(),
				points = this.getPoints(),
				idx = 1, length = points.length;
			
			context.beginPath();
			context.moveTo(points[0].x, points[0].y);

			for (; idx < length; idx += 1) {
				context.lineTo(points[idx].x, points[idx].y);
			}

			context.closePath();
			canvas.fillAndStroke(this);
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
			return '[Polygon]';
		}
	});

	Gear.Polygon = Polygon;

}(Gear, Gear.Const, Gear.Util));
