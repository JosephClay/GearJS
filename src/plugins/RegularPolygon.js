(function(Gear, Constants) {
	
	/**
	 * Examples include triangles, squares, pentagons, hexagons, etc.
	 * @param {Object} config
	 * @param {Number} config.sides
	 * @param {Number} config.radius
	 * @example
	 * var hexagon = new RegularPolygon({
	 *   x: 100,
	 *   y: 200,
	 *   sides: 6,
	 *   radius: 70,
	 *   fill: 'red',
	 *   stroke: 'black',
	 *   strokeWidth: 4
	 * });
	 */
	var RegularPolygon = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.REGULAR_POLYGON;
	};

	_.extend(RegularPolygon.prototype, Gear.Shape.prototype, {
		draw: function(canvas) {
			var context = canvas.getContext(),
				sides = this.attr.sides,
				radius = this.attr.radius;

			context.beginPath();
			context.moveTo(0, 0 - radius);

			var idx = 1,
				x, y;
			for (; idx < sides; idx += 1) {
				x = radius * Math.sin(idx * 2 * Math.PI / sides);
				y = -1 * radius * Math.cos(idx * 2 * Math.PI / sides);
				context.lineTo(x, y);
			}
			context.closePath();
			canvas.fillAndStroke(this);
		},
		
		getRadius: function() {
			var val = this.attr.radius;
			return (!_.exists(val)) ? 0 : val;
		},
		setRadius: function(val) {
			this.attr.radius = val;
		},

		getSides: function() {
			var val = this.attr.sides;
			return (!_.exists(val)) ? 0 : val;
		},
		setSides: function(val) {
			this.attr.sides = val;
		}

	});

	Gear.RegularPolygon = RegularPolygon;

}(Gear, Gear.Constants));
