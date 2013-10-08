(function(Gear, Constants, Util) {

	/**
	 * Blobs are defined by an array of points and a tension
	 * @param {Object} config
	 * @param {Array} config.points an array of points
	 * @param {Number} [config.tension] default value is 1
	 * @example
	 * var blob = new Gear.Blob({
	 *   points: [
	 *   	{ x: 73, y: 140 },
	 *   	{ x: 340, y: 23 },
	 *   	{ x: 500, y: 109 },
	 *   	{ x: 300, y: 170 }
	 *   ],
	 *   tension: 0.8,
	 *   fill: 'red'
	 * });
	 */
	var Blob = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.BLOB;

		var self = this;
		this.on('pointsChange.gear tensionChange.gear', function() {
			self._setAllPoints();
		});

		this._setAllPoints();
	};

	_.extend(Blob.prototype, Gear.Shape.prototype, {
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
				idx = 0;

				while (idx < allPointsLength - 1) {
					context.bezierCurveTo(allPoints[idx].x, allPoints[idx++].y, allPoints[idx].x, allPoints[idx++].y, allPoints[idx].x, allPoints[idx++].y);
				}
			} else { // no tension
				idx = 1;
				for (; idx < pointsLength; idx += 1) {
					point = points[idx];
					context.lineTo(point.x, point.y);
				}
			}

			context.closePath();
			canvas.fillAndStroke(this);
		},
		
		_setAllPoints: function() {
			var points = this.getPoints(),
				length = points.length,
				tension = this.getTension(),
				firstControlPoints = Util.getControlPoints(points[length - 1], points[0], points[1], tension),
				lastControlPoints = Util.getControlPoints(points[length - 2], points[length - 1], points[0], tension);

			this.allPoints = Util.expandPoints(this.getPoints(), this.getTension());

			// prepend control point
			this.allPoints.unshift(firstControlPoints[1]);

			// append cp, point, cp, cp, first point
			this.allPoints.push(lastControlPoints[0]);
			this.allPoints.push(points[length - 1]);
			this.allPoints.push(lastControlPoints[1]);
			this.allPoints.push(firstControlPoints[0]);
			this.allPoints.push(points[0]);
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

		getTension: function() {
			var val = this.attr.tension;
			return (!_.exists(val)) ? 1 : val;
		},
		setTension: function(val) {
			this.attr.tension = val;
		},

		toString: function() {
			return '[Blob]';
		}
	});

	Gear.Blob = Blob;

}(Gear, Gear.Constants, Gear.Util));