(function(Gear, Constants, Util) {

	/**
	 * A circle
	 * @param {Object} config
	 * @example
	 * var circle = new Circle({
	 *   radius: 40,
	 *   fill: 'blue'
	 * });
	 */
	var Circle = function(config) {
		config = _.extend({}, this.defaults, config);
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.CIRCLE;
	};

	Circle.extend = Util.extend;

	Util.construct(Circle.prototype, Gear.Shape.prototype, {
		draw: function(canvas) {
			var context = canvas.getContext(),
				// Already applied via transform
				x = 0, y = 0;

			context.beginPath();
			context.arc(x, y, this.getRadius(), 0, Gear.Math.PIx2, false);
			context.closePath();
			canvas.fillAndStroke(this);
		},

		getWidth: function() {
			return this.getDiameter();
		},

		setWidth: function(width) {
			Gear.Node.prototype.setWidth.call(this, width);
			return this.setDiameter(width);
		},

		getHeight: function() {
			return this.getRadius() * 2;
		},

		setHeight: function(height) {
			Gear.Node.prototype.setHeight.call(this, height);
			this.setRadius(height / 2);
			return this;
		},

		getRadius: function() {
			var val = this.attr.radius;
			return (!_.exists(val)) ? 0 : val;
		},

		setRadius: function(val) {
			this.attr.radius = val;
			return this;
		},

		getDiameter: function() {
			return this.getRadius() * 2;
		},

		setDiameter: function(val) {
			this.setRadius(val / 2);
			return this;
		},

		toString: function() {
			return '[Circle]';
		}
	});

	Gear.Circle = Circle;

}(Gear, Gear.Const, Gear.Util));
