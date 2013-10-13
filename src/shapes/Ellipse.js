(function(Gear, Constants) {

	/**
	 * An ellipse
	 * @param {Object} config
	 * @param {Object} config.radius defines x and y radius
	 */
	var Ellipse = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.ELLIPSE;
	};

	_.extend(Ellipse.prototype, Gear.Shape.prototype, {
		draw: function(canvas) {
			var context = canvas.getContext(),
				radius = this.getRadius(),
				// Already applied via transform
				x = 0, y = 0;
			
			context.beginPath();
			context.save();
			
			if (radius.x !== radius.y) {
				context.scale(1, radius.y / radius.x);
			}
			
			context.arc(x, y, radius.x, 0, Gear.Math.PIx2, false);
			context.restore();
			context.closePath();
			canvas.fillAndStroke(this);
		},

		// BUG: ellipse.rotate(45) does not rotate on its axis
		// Override width and height for our purposes
		getWidth: function() {
			return (this.getRadius().x * 2);
		},
		setWidth: function(width) {
			Gear.Node.prototype.setWidth.call(this, width);
			this.setRadius({ x: width / 2 });
			return this;
		},

		getHeight: function() {
			return (this.getRadius().y * 2);
		},
		setHeight: function(height) {
			Gear.Node.prototype.setHeight.call(this, height);
			this.setRadius({ y: height / 2 });
			return this;
		},

		getRadius: function() {
			var radius = this.attr.radius || (this.attr.radius = { x: 0, y: 0});
			return radius;
		},
		setRadius: function(point) {
			if (!point) { return; }
			
			point = Gear.point.parse(point);
			this.setRadiusX(point.x);
			this.setRadiusY(point.y);
			return this;
		},

		toString: function() {
			return '[Ellipse]';
		}
	});

	Gear.Ellipse = Ellipse;

}(Gear, Gear.Constants));