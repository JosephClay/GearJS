(function(Gear, Constants, Util) {

	/**
	 * Splines are defined by an array of points and a tension
	 * @param {Object} config
	 * @param {Array} config.points an array of points
	 * @param {Number} config.tension default value is 1
	 * @example
	 * var spline = new Gear.Spline({
	 *   x: 100,
	 *   y: 50,
	 *   points: [
	 *     { x: 73, y: 70 },
	 *     { x: 340, y: 23 },
	 *     { x: 450, y: 60 },
	 *     { x: 500, y: 20 }
	 *   ],
	 *   stroke: 'green',
	 *   tension: 1
	 * });
	 */
	var Spline = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.SPLINE;
		this._setAllPoints();
	};

	_.extend(Spline.prototype, Gear.Shape.prototype, {
		draw: function(canvas) {
			var allPoints = this.allPoints,
				allPointsLength = allPoints.length,
				points = this.getPoints(),
				pointsLength = points.length,
				context = canvas.getContext(),
				tension = this.getTension(),
				idx, point;

			context.beginPath();
			context.moveTo(points[0].x, points[0].y);

			if (tension !== 0 && pointsLength > 2) { // tension

				context.quadraticCurveTo(allPoints[0].x, allPoints[0].y, allPoints[1].x, allPoints[1].y);

				idx = 2;
				while (idx < allPointsLength - 1) {
					context.bezierCurveTo(allPoints[idx].x, allPoints[idx++].y, allPoints[idx].x, allPoints[idx++].y, allPoints[idx].x, allPoints[idx++].y);
				}

				context.quadraticCurveTo(allPoints[allPointsLength - 1].x, allPoints[allPointsLength - 1].y, points[pointsLength - 1].x, points[pointsLength - 1].y);

			} else { // no tension
				
				idx = 1;
				for (; idx < pointsLength; idx += 1) {
					point = points[idx];
					context.lineTo(point.x, point.y);
				}
			}

			// TODO: This paradigm is being used a lot, fix
			var stroke = this.getStroke(),
				isEnabled = stroke ? stroke.isEnabled() : false;
			if (!isEnabled) { return; }
			stroke.stroke(canvas, this);
		},

		_setAllPoints: function() {
			this.allPoints = Util.expandPoints(this.getPoints(), this.getTension());
		},

		addPoint: function(point) {
			var currentPoints = this.attr.points;
			point = Gear.point.parse(point);

			currentPoints.push(point);
			this.setPoints(currentPoints);
			return this;
		},

		getPoints: function() {
			return this.attr.points || (this.attr.points = []);
		},
		setPoints: function(val) {
			this.set.points = Gear.point.getPoints(val);
			this._setAllPoints();
			return this;
		},

		getTension: function() {
			var val = this.attr.tension;
			return (!_.exists(val)) ? 1 : val;
		},
		setTension: function(val) {
			this.set.tension = val;
			this._setAllPoints();
			return this;
		},

		toString: function() {
			return '[Spline]';
		}
	});
	
	Gear.Spline = Spline;

}(Gear, Gear.Constants, Gear.Util));
