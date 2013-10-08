(function(Gear, Util) {

	var _planes = [];

	var Plane = function(config) {
		this.set(config);
	};

	Plane.prototype = {
		/**
		 * Sets the position and size of the Plane
		 * @param {Object} config
		 * @return {Plane} this
		 */
		set: function(config) {
			config = config || {};

			this.setX(config.x);
			this.setY(config.y);
			this.setWidth(config.width);
			this.setHeight(config.height);

			return this;
		},

		/**
		 * Adjusts the location of the Plane object using a Point object as a parameter.
		 * @param {Point} point
		 * @return {Plane} this
		 */
		offset: function(point) {
			point = Gear.point.parse(point);
			return this._offset(point.x, point.y);
		},

		/**
		 * Adjusts the location of the Plane object, as determined by its top-left
		 * corner, by the specified amounts
		 * @param {Number} deltaX Moves the x value of the Plane object by this amount
		 * @param {Number} deltaY Moves the y value of the Plane object by this amount
		 * @return {Plane} this
		 */
		_offset: function(deltaX, deltaY) {
			this.setX(this.getX() + (deltaX || 0));
			this.setY(this.getY() + (deltaY || 0));
			return this;
		},
	 
		/**
		 * Runs Math.floor() on both the x and y values of this Plane.
		 */
		floor: function() {
			this.setX(~~this.getX());
			this.setY(~~this.getY());
		},
	 
		/**
		 * Increases the size of the Plane object by the specified amounts.
		 * @param {Number} deltaX The amount to be added to the left side of the Plane.
		 * @param {Number} deltaY The amount to be added to the bottom side of the Plane.
		 * @return {Plane} this
		 */
		inflate: function(deltaX, deltaY) {

			var x = this.getX(),
				y = this.getY(),
				width = this.getWidth(),
				height = this.getHeight();

			this.setX(x - deltaX);
			this.setWidth(width + (deltaX * 2));
			this.setY(y - deltaY);
			this.setHeight(height + (deltaY * 2));

			return this;
		},

		/**
		 * The size of the Plane object, expressed as an object with a width and height.
		 * @return {Object} The size of the Plane object
		 */
		size: function() {
			return {
				width: this.getWidth(),
				height: this.getHeight()
			};
		},

		/**
		 * Returns a new, identical Plane.
		 * @return {Plane}
		 */
		clone: function() {
			return new Plane(this.toObject());
		},

		/**
		 * Determines whether the specified coordinates are contained within the region defined by this Plane object.
		 * @param {Number} x The x coordinate of the point to test.
		 * @param {Number} y The y coordinate of the point to test.
		 * @return {Boolean} A value of true if the Plane object contains the specified point; otherwise false.
		 */
		contains: function(x, y) {
			return (x >= this.getX() && x <= this.getRight() && y >= this.getY() && y <= this.getBottom());
		},

		/**
		 * Determines whether the two Planes are equal.
		 * @param {Plane} plane The second Plane object.
		 * @return {Boolean}
		 */
		equals: function(plane) {
			return (this.getX() === plane.getX() && this.getY() === plane.getY() && this.getWidth() === plane.getWidth() && this.getHeight() === plane.getHeight());
		},

		/**
		 * If the Plane object specified in the toIntersect parameter intersects with this Plane object,
		 * returns the area of intersection as a Plane object. If the Planes do not intersect,
		 * this method returns an empty Plane object with its properties set to 0.
		 * @param {Plane} plane
		 * @return {Plane} A Plane object that equals the area of intersection.
		 */
		intersection: function(plane) {
			if (!this.intersects(plane)) { return new Plane(); }

			return new Plane({
				x: Math.max(this.getX(), plane.getX()),
				y: Math.max(this.getY(), plane.getY()),
				width: Math.min(this.getRight(), plane.getRight()),
				height: Math.min(this.getBottom(), plane.getBottom())
			});
		},

		/**
		 * Determines whether the two Planes intersect with each other.
		 * @param {Plane} plane The second Plane object.
		 * @param {Number} tolerance optional A tolerance value to allow for an intersection test with padding, default to 0.
		 * @return {Boolean}
		 */
		intersects: function(plane, tolerance) {
			tolerance = tolerance || 0;
			return !(this.getX() > plane.getRight() + tolerance || this.getRight() < plane.getX() - tolerance || this.getY() > plane.getBottom() + tolerance || this.getBottom() < plane.getY() - tolerance);
		},

		/**
		 * Resets this plane's values to 0
		 * @return {Plane} this
		 */
		clear: function() {
			this.x = this.y = this.width = this.height = 0;
			return this;
		},

		/**
		 * Destroy this plane
		 */
		destroy: function() {
			this.clear();
			_planes.push(this);
		},

		toObject: function() {
			return {
				width: this.getWidth(),
				height: this.getHeight(),
				x: this.getX(),
				y: this.getY()
			};
		},

		getX: function() {
			return this.x;
		},

		setX: function(x) {
			this.x = x || 0;
		},

		getY: function() {
			return this.y;
		},

		setY: function(y) {
			this.y = y || 0;
		},

		getWidth: function() {
			return this.width;
		},

		setWidth: function(width) {
			this.width = width || 0;
		},

		getHeight: function() {
			return this.height;
		},

		setHeight: function(height) {
			this.height = height || 0;
		},

		/**
		 * Half of the width of the Plane
		 * @return {Number}
		 */
		getHalfWidth: function() {
			return Math.round(this.getWidth() / 2);
		},

		/**
		 * Half of the height of the Plane
		 * @return {Number}
		 */
		getHalfHeight: function() {
			return Math.round(this.getHeight() / 2);
		},

		/**
		 * The sum of the y and height properties.
		 * @return {Number}
		 */
		getBottom: function() {
			return this.getY() + this.getHeight();
		},

		/**
		 * The sum of the y and height properties.
		 * @param {Number} value
		 */    
		setBottom: function(value) {
			if (value <= this.getY()) {
				this.setHeight(0);
			} else {
				this.setHeight(this.getY() - value);
			}
		},

		/**
		 * Get the location of the Planes bottom right corner as a Point object.
		 * @return {Point}
		 */
		getBottomRight: function() {
			return Gear.point({
				x: this.getRight(),
				y: this.getBottom()
			});
		},

		/**
		 * Sets the bottom-right corner of the Plane, determined by the values of the given Point object.
		 * @param {Point} point
		 */
		setBottomRight: function(point) {
			point = Gear.point.parse(point);

			this.setRight(point.x);
			this.setBottom(point.y);
		},

		/**
		 * The x coordinate of the left of the Plane.
		 * @return {Number}
		 */    
		getLeft: function() {
			return this.getX();
		},

		/**
		 * The x coordinate of the left of the Plane.
		 * @param {Number} value
		 */
		setLeft: function(value) {
			if (value >= this.getRight()) {
				this.setWidth(0);
			} else {
				this.setWidth(this.getRight() - value);
			}

			this.setX(value);
		},

		/**
		 * The sum of the x and width properties.
		 * @return {Number}
		 */    
		getRight: function() {
			return this.getX() + this.getWidth();
		},

		/**
		 * The sum of the x and width properties.
		 * @param {Number} value
		 */
		setRight: function(value) {
			if (value <= this.getX()) {
				this.setWidth(0);
			} else {
				this.setWidth(this.getX() + value);
			}
		},

		/**
		 * The volume of the Plane derived from width * height
		 * @return {Number}
		 */    
		getVolume: function() {
			return this.getWidth() * this.getHeight();
		},

		/**
		 * The perimeter size of the Plane. This is the sum of all 4 sides.
		 * @return {Number}
		 */
		getPerimeter: function() {
			return (this.getWidth() * 2) + (this.getHeight() * 2);
		},

		/**
		 * The x coordinate of the center of the Plane.
		 * @return {Number}
		 */
		getCenterX: function() {
			return this.getX() + this.getHalfWidth();
		},

		/**
		 * The x coordinate of the center of the Plane.
		 * @param {Number} value
		 */
		setCenterX: function(value) {
			this.setX(value - this.getHalfWidth());
		},

		/**
		 * The y coordinate of the center of the Plane.
		 * @return {Number}
		 */
		getCenterY: function() {
			return this.getY() + this.getHalfHeight();
		},

		/**
		 * The y coordinate of the center of the Plane.
		 * @param {Number} value
		 */
		setCenterY: function(value) {
			this.setY(value - this.getHalfHeight());
		},

		/**
		 * The y coordinate of the top of the Plane.
		 * @return {Number}
		 */
		getTop: function() {
			return this.getY();
		},

		/**
		 * The y coordinate of the top of the Plane.
		 * @param {Number} value
		 */
		setTop: function(value) {
			if (value >= this.getBottom()) {
				this.setHeight(0);
				this.setY(value);
			} else {
				this.setHeight(this.getBottom() - value);
			}
		},

		/**
		 * Get the location of the Planes top left corner as a Point object.
		 * @return {Point}
		 */
		getTopLeft: function() {
			return Gear.point({
				x: this.getX(),
				y: this.getY()
			});
		},

		/**
		 * The location of the Planes top-left corner, determined by the x and y coordinates of the Point.
		 * @param {Point} point
		 */
		setTopLeft: function(point) {
			point = Gear.point.parse(point);

			this.setX(point.x);
			this.setY(point.y);
		},

		/**
		 * Determines whether or not this Plane object is empty.
		 * @return {Boolean}
		 */
		isEmpty: function() {
			return (!this.width || !this.height);
		},

		/**
		 * Returns a string representation of this plane.
		 * @return {String}
		 */
		toString: function() {
			return '[Plane (x=' + this.x + ' y=' + this.y + ' width=' + this.width + ' height=' + this.height + ' isEmpty=' + this.isEmpty + ')]';
		}
	};

	var publicPlane = function(obj) {
		var plane;

		if (obj instanceof Plane) {
			return obj;
		}

		if (_planes.length) {
			plane = _planes.pop();
			return plane.set(obj);
		}

		return new Plane(obj);
	};

	Gear.Plane = publicPlane;

}(Gear, Gear.Util));