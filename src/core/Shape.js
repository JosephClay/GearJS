(function(Gear, Global, Constants, Util) {
	
	/**
	 * Shapes are primitive form, such as: rectangles, circles, lines, etc...
	 * @param {Object} config
	 */
	var Shape = function(config) {
		Gear.Node.call(this, config);
		
		this.nodeType = Constants.NODE_TYPE.SHAPE;
		this._colorKey = Gear.Color.getUnique();
		Global.shapes[this._colorKey] = this;
	};

	_.extend(Shape.prototype, Gear.Node.prototype, {

		/**
		 * Get the unique color id for this shape
		 * @return {String} color
		 */
		getColorId: function() {
			return this._colorKey;
		},

		drawScene: function(canvas) {
			// Get the draw. Use getDraw to allow an attr
			// to take precedence, otherwise, use the draw
			// as defined by this
			var draw = this.getDraw() || this.draw;
			if (!draw || !this.isVisible()) { return this; }

			canvas = canvas || this.getLayer().getCanvas();

			var context = canvas.getContext();

			context.save();
			canvas.applyOpacity(this);
			canvas.applyLineJoin(this);
			canvas.applyAncestorTransforms(this);
			canvas.applyRotation(this);

			draw.call(this, canvas);
			context.restore();
			
			return this;
		},

		drawHit: function() {
			var draw = this.getDraw() || this.draw;
			if (!draw || !this.shouldDrawHit()) { return this; }

			var canvas = this.getLayer().getHitCanvas(),
				context = canvas.getContext();

			context.save();
			canvas.applyLineJoin(this);
			canvas.applyAncestorTransforms(this);
			canvas.applyRotation(this);
			draw.call(this, canvas);
			context.restore();

			return this;
		},

		getLineJoin: function() {
			return this.attr.lineJoin;
		},
		setLineJoin: function(joint) {
			this.attr.lineJoin = joint;
			return this;
		},

		/**
		 * Whether a stroke is set
		 * @return {Boolean}
		 */
		hasStroke: function() {
			var stroke = this.getStroke();
			return (stroke && stroke.isEnabled() && stroke.getWidth() > 0);
		},
		getStroke: function() {
			return this.attr.stroke;
		},
		setStroke: function(config) {
			if (config instanceof Gear.Stroke) {
				this.attr.stroke = config;
				return this;
			}

			this.attr.stroke = new Gear.Stroke(config);
			return this;
		},

		/**
		 * Whether a fill is set
		 * @return {Boolean}
		 */
		hasFill: function() {
			var fill = this.getFill();
			return (fill && fill.isEnabled());
		},
		getFill: function() {
			return this.attr.fill;
		},
		setFill: function(fill) {
			if (Gear.Fill.isFill(fill)) {
				this.att.fill = fill;
			}
			
			this.attr.fill = Gear.Fill.parse(fill);
			return this;
		},

		/**
		 * Whether a shadow is set
		 * @return {Boolean}
		 */
		hasShadow: function() {
			var shadow = this.getShadow();
			return (shadow && shadow.isEnabled() && shadow.getOpacity() !== 0);
		},
		getShadow: function() {
			return this.attr.shadow;
		},
		setShadow: function(config) {
			if (config instanceof Gear.Shadow) {
				this.attr.shadow = config;
				return this;
			}

			this.attr.shadow = new Gear.Shadow(config);
			return this;
		},

		destroy: function() {
			Gear.Node.prototype.destroy.call(this);
			delete Global.shapes[this.getColorId()];
			return this;
		},

		toString: function() {
			return '[Shape]';
		}
	});
	
	Gear.Shape = Shape;

}(Gear, Gear.Global, Gear.Constants, Gear.Util));