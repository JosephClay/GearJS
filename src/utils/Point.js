(function(Gear) {

	/**
	 * @return {Object} x and y values
	 */
	var _parse = function(point) {
		if (!_.exists(point)) {
			return {
				x: 0,
				y: 0
			};
		}

		if (_.isObject(point)) {
			return point;
		}

		if (_.isNumber(point)) {
			return {
				x: point,
				y: point
			};
		}

		// if point is an array of two or more elements
		if (_.isArray(point) && point.length >= 2) {
			return {
				x: point[0],
				y: point[1]
			};
		}

		return { x: 0, y: 0 };
	};

	/**
	 * The argument can be:
	 * - an array of numbers
	 * - an array of point arrays
	 * - an array of point objects
	 * @return {Array} Points
	 */
	var _getPoints = function() {
		var arg = arguments;

		// an array of objects
		if (_.isObject(arg[0])) {
			return arg;
		}

		var arr = [],
			idx = 0, length = arg.length;
		
		// an array of arrays
		if (_.isArray(arg[0])) {
			// convert array of arrays into an array
			// of objects containing x, y
			for (; idx < length; idx += 1) {
				arr.push(
					Gear.point({
						x: arg[idx][0],
						y: arg[idx][1]
					})
				);
			}

			return arr;
		}

		// an array of integers
		// convert array of numbers into an array
		// of objects containing x, y
		for (; idx < length; idx += 2) {
			arr.push(
				Gear.point({
					x: arg[idx],
					y: arg[idx + 1]
				})
			);
		}

		return arr;
	};

	var Point = function(config) {
		this.set(config);
	};
	Point.prototype = {
		/**
		 * Sets the position of the Point
		 * @param {Object} config
		 * @return {Point} this
		 */
		set: function(config) {
			config = config || {};

			this.x = config.x || 0;
			this.y = config.y || 0;
			return this;
		},

		floor: function() {
			this.x = ~~this.x;
			this.y = ~~this.y;
			return this;
		},

		equals: function(point) {
			return (this.getX() === point.getX() && this.getY() && point.getY());
		},

		/**
		 * Resets this point's values to 0
		 * @return {Point} this
		 */
		clear: function() {
			this.x = this.y = 0;
			return this;
		},

		/**
		 * An array of this point's values
		 * @return {Array}
		 */
		toArray: function() {
			return [this.x, this.y];
		},

		/**
		 * An object of this point's values
		 * @return {Object}
		 */
		toObject: function() {
			return {
				x: this.x,
				y: this.y
			};
		},

		/**
		 * Returns a new, identical Point.
		 * @return {Point}
		 */
		clone: function() {
			return Gear.point({ x: this.x, y: this.y });
		},

		/**
		 * Destroy this point
		 */
		destroy: function() {
			this.clear();
			_points.push(this);
		},

		getX: function() {
			return this.x;
		},

		setX: function(x) {
			this.x = x || 0;
			return this;
		},

		getY: function() {
			return this.y;
		},

		setY: function(y) {
			this.y = y || 0;
			return this;
		},

		/**
		 * Rotates the point around another point using an angle
		 * @param  {Number} x
		 * @param  {Number} y
		 * @param  {Number} angle
		 * @param  {Number} distance optional
		 * @return {this}
		 */
		rotate: function(x, y, angle, distance) {

		    angle = Phaser.Math.radToDeg(angle);
			
			// Get distance using Pythagorean Theorem
			if (!_.exists(distance)) {
			    distance = Math.sqrt(
					((x - this.x) * (x - this.x)) + ((y - this.y) * (y - this.y))
				);
			}

			this.setTo(x + distance * Math.cos(angle), y + distance * Math.sin(angle));
			return this;
		},

		/**
		 * Returns a string representation of this point.
		 * @return {String}
		 */
		toString: function() {
			return '[Point (x='+ this.x +' y='+ this.y +')]';
		}
	};

	var _points = [];
	var publicPoint = function(obj) {
		var point;

		if (obj instanceof Point) {
			return obj;
		}

		if (_points.length) {
			point = _points.pop();
			return point.set(obj);
		}

		return new Point(obj);
	};
	publicPoint.parse = _parse;
	publicPoint.getPoints = _getPoints;

	Gear.point = publicPoint;

}(Gear));