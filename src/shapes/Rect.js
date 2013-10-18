(function(Gear, Constants, Util) {

	/**
	 * A rectangle
	 * @param {Object} config
	 * @example
	 * var rect = new Rect({
	 *   width: 100,
	 *   height: 50,
	 *   fill: 'blue'
	 * });
	 */
	var Rect = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.RECT;
	};

	Rect.extend = Util.extend;

	Util.construct(Rect.prototype, Gear.Shape.prototype, {
		draw: function(canvas) {
			var context = canvas.getContext(),
				cornerRadius = this.getCornerRadius(),
				size = this.getSize(),
				width = size.width,
				height = size.height,
				// Already applied via transform
				x = 0, y = 0;

			context.beginPath();

			if (!cornerRadius) {
				// simple rect - don't bother doing all that complicated maths stuff.
				context.rect(x, y, width, height);
			} else {
				// draw top and top right corner
				context.moveTo(x + cornerRadius, y);
				context.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);

				// draw right side and bottom right corner
				context.arcTo(x + width, y + height, x + width - cornerRadius, y + height, cornerRadius); 

				// draw bottom and bottom left corner
				context.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius);

				// draw left and top left corner
				context.arcTo(x, y, x + cornerRadius, y, cornerRadius);
			}
			
			context.closePath();
			canvas.fillAndStroke(this);
		},

		getCornerRadius: function() {
			return this.attr.cornerRadius || 0;
		},

		setCornerRadius: function(val) {
			this.attr.cornerRadius = val;
		},

		toString: function() {
			return '[Rect]';
		}
	});

	Gear.Rect = Rect;

}(Gear, Gear.Constants, Gear.Util));
