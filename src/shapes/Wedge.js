(function(Gear, Constants, Util) {
	
	/**
	 * Draw a wedge
	 * @param {Object} config
	 * @param {Number} config.angle
	 * @param {Number} config.radius
	 * @param {Boolean} config.isClockwise
	 * @example
	 * var wedge = new Wedge({
	 *   radius: 40,
	 *   angle: 60,
	 *   isClockwise: true
	 * });
	 */
	var Wedge = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.WEDGE;
	};

	Wedge.extend = Util.extend;

	Util.construct(Wedge.prototype, Gear.Shape.prototype, {
		draw: function(canvas) {
			var context = canvas.getContext(),
				radius = this.getRadius(),
				// Already applied via transform
				x = 0, y = 0;
			
			context.beginPath();
			context.arc(x, y, radius, 0, Gear.Math.degToRad(this.getAngle()), this.isClockwise());
			context.lineTo(x, y);
			context.closePath();
			canvas.fillAndStroke(this);
		},

		getRadius: function() {
			var val = this.attr.radius;
			return (!_.exists(val)) ? 0 : val;
		},

		setRadius: function(val) {
			this.attr.radius = val;
			return this;
		},
		
		getAngle: function() {
			var val = this.attr.angle;
			return !_.exists(val) ? 90 : val;
		},

		setAngle: function(deg) { // degrees
			this.attr.angle = deg;
			return this;
		},

		isClockwise: function() {
			var val = this.attr.clockwise;
			return (!_.exists(val)) ? false : val;
		},

		setClockwise: function(val) {
			this.attr.clockwise = !!val;
		},

		toString: function() {
			return '[Wedge]';
		}
	});

	Gear.Wedge = Wedge;

}(Gear, Gear.Constants, Gear.Util));
