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

		// TODO: Move this to node
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
		setLineJoin: function(val) {
			this.attr.lineJoin = val;
			return this;
		},

		// TODO: Document definitions for many of these
		getStroke: function() {
			return this.attr.stroke;
		},
		setStroke: function(val) {
			this.attr.stroke = val;
		},

		/**
		 * Whether a fill is set
		 * @return {Boolean}
		 */
		hasFill: function() {
			return !!this.getFill();
		},
		getFill: function() {
			return this.attr.fill;
		},
		setFill: function(val) {
			this.attr.fill = val;
		},
		
		isShadowEnabled: function() {
			return this.getShadowEnabled();
		},
		getShadowEnabled: function() {
			var val = this.attr.shadowEnabled;
			return (!_.exists(val)) ? true : val;
		},
		setShadowEnabled: function(val) {
			this.attr.shadowEnabled = val;
		},
		
		/**
		 * Whether a shadow is set
		 * @return {Boolean}
		 */
		hasShadow: function() {
			var shadow = this.getShadow();
			return (shadow.opacity !== 0 && !!(shadow.color || shadow.blur || shadow.offset.x || shadow.offset.y));
		},
		getShadow: function() {
			var shadow = this.attr.shadow || (this.attr.shadow = {
				color: '',
				blur: 0,
				opacity: 0,
				offset: { x: 0, y: 0 }
			});
			return shadow;
		},
		setShadow: function(config) {
			config = config || {};
			var shadow = this.getShadow();

			if (_.exists(config.color)) {
				shadow.color = config.color;
			}
			if (_.exists(config.blur)) {
				shadow.blur = config.blur;
			}
			if (_.exists(config.opacity)) {
				shadow.opacity = config.opacity;
			}
			if (config.offset) {
				config.offset = Gear.point.parse(config.offset);
			}

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