(function(Gear, Constants) {

	/**
	 * A Tag can be configured to have a pointer element that points up, right, down, or left
	 * @param {String} [config.pointerDirection] can be up, right, down, left, or none; the default
	 * is none.  When a pointer is present, the positioning of the label is relative to the tip of the pointer.
	 * @param {Number} [config.pointerWidth]
	 * @param {Number} [config.pointerHeight]
	 * @param {Number} [config.cornerRadius]
	 */
	var Tag = function(config) {
		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.TAG;
	};

	_.extend(Tag.prototype, Gear.Shape.prototype, {
		draw: function(canvas) {
			var context = canvas.getContext(),
				width = this.getWidth(),
				height = this.getHeight(),
				pointerDirection = this.getPointerDirection(),
				pointerWidth = this.getPointerWidth(),
				pointerHeight = this.getPointerHeight(),
				cornerRadius = this.getCornerRadius();

			context.beginPath();
			context.moveTo(0,0);

			if (pointerDirection === Constants.UP) {
				context.lineTo((width - pointerWidth)/2, 0);
				context.lineTo(width/2, pointerHeight * -1);
				context.lineTo((width + pointerWidth)/2, 0);
			}

			context.lineTo(width, 0);

			if (pointerDirection === Constants.RIGHT) {
				context.lineTo(width, (height - pointerHeight)/2);
				context.lineTo(width + pointerWidth, height/2);
				context.lineTo(width, (height + pointerHeight)/2);
			}

			context.lineTo(width, height);

			if (pointerDirection === Constants.DOWN) {
				context.lineTo((width + pointerWidth)/2, height);
				context.lineTo(width/2, height + pointerHeight);
				context.lineTo((width - pointerWidth)/2, height);
			}

			context.lineTo(0, height);

			if (pointerDirection === Constants.LEFT) {
				context.lineTo(0, (height + pointerHeight)/2);
				context.lineTo(pointerWidth * -1, height/2);
				context.lineTo(0, (height - pointerHeight)/2);
			}

			context.closePath();
			canvas.fillAndStroke(this);
		},

		getPointerDirection: function() {
			var val = this.attr.pointerDirection;
			return (!_.exists(val)) ? 'none' : val;
		},
		setPointerDirection: function(val) {
			this.attr.pointerDirection = val;
		},

		getPointerWidth: function() {
			var val = this.attr.pointerWidth;
			return (!_.exists(val)) ? 0 : val;
		},
		setPointerWidth: function(val) {
			this.attr.pointerWidth = val;
		},

		getPointerHeight: function() {
			var val = this.attr.pointerHeight;
			return (!_.exists(val)) ? 0 : val;
		},
		setPointerHeight: function(val) {
			this.attr.pointerHeight = val;
		},

		getCornerRadius: function() {
			var val = this.attr.cornerRadius;
			return (!_.exists(val)) ? 0 : val;
		},
		setCornerRadius: function(val) {
			this.attr.cornerRadius = val;
		}
	});

	Gear.Tag = Tag;

}(Gear, Gear.Constants));