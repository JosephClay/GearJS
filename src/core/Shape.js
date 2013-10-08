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

		/**
		 * Whether a shadow will be rendered
		 * @return {Boolean}
		 */
		hasShadow: function() {
			var shadow = this.getShadow();
			return (shadow.opacity !== 0 && !!(shadow.color || shadow.blur || shadow.offset.x || shadow.offset.y));
		},

		/**
		 * Whether a fill will be rendered
		 * @return {Boolean}
		 */
		hasFill: function() {
			return !!(this.getFill() || this.getFillPatternImage() || this.getFillLinearGradientColorStops() || this.getFillRadialGradientColorStops());
		},

		enableFill: function() {
			this.attr.fillEnabled = true;
			return this;
		},

		disableFill: function() {
			this.attr.fillEnabled = false;
			return this;
		},

		enableStroke: function() {
			this.attr.strokeEnabled = true;
			return this;
		},

		disableStroke: function() {
			this.attr.strokeEnabled = false;
			return this;
		},

		enableStrokeScale: function() {
			this.attr.strokeScaleEnabled = true;
			return this;
		},

		disableStrokeScale: function() {
			this.attr.strokeScaleEnabled = false;
			return this;
		},

		enableShadow: function() {
			this.attr.shadowEnabled = true;
			return this;
		},

		disableShadow: function() {
			this.attr.shadowEnabled = false;
			return this;
		},

		enableDashArray: function() {
			this.attr.dashArrayEnabled = true;
			return this;
		},

		disableDashArray: function() {
			this.attr.dashArrayEnabled = false;
			return this;
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

		// TODO: Document definitions for many of these
		getStroke: function() {
			return this.attr.stroke;
		},
		setStroke: function(val) {
			this.attr.stroke = val;
		},

		getFill: function() {
			return this.attr.fill;
		},
		setFill: function(val) {
			this.attr.fill = val;
		},
		
		getLineJoin: function() {
			return this.attr.lineJoin;
		},
		setLineJoin: function(val) {
			this.attr.lineJoin = val;
		},

		getLineCap: function() {
			return this.attr.lineCap;
		},
		setLineCap: function(val) {
			this.attr.lineCap = val;
		},

		getStrokeWidth: function() {
			return this.attr.strokeWidth;
		},
		setStrokeWidth: function(val) {
			this.attr.strokeWidth = val;
		},

		getDashArray: function() {
			return this.attr.dashArray;
		},
		setDashArray: function(val) {
			this.attr.dashArray = val;
		},

		getFillPatternImage: function() {
			return this.attr.fillPatternImage;
		},
		setFillPatternImage: function(val) {
			this.attr.fillPatternImage = val;
		},

		getFillPatternX: function() {
			return this.attr.fillPatternX;
		},
		setFillPatternX: function(val) {
			this.attr.fillPatternX = val;
		},

		getFillPatternY: function() {
			return this.attr.fillPatternY;
		},
		setFillPatternY: function(val) {
			this.attr.fillPatternY = val;
		},

		getFillLinearGradientColorStops: function() {
			return this.attr.fillLinearGradientColorStops;
		},
		setFillLinearGradientColorStops: function(val) {
			this.attr.fillLinearGradientColorStops = val;
		},

		getFillRadialGradientStartRadius: function() {
			return this.attr.fillRadialGradientStartRadius;
		},
		setFillRadialGradientStartRadius: function(val) {
			this.attr.fillRadialGradientStartRadius = val;
		},

		getFillRadialGradientEndRadius: function() {
			return this.attr.fillRadialGradientEndRadius;
		},
		setFillRadialGradientEndRadius: function(val) {
			this.attr.fillRadialGradientEndRadius = val;
		},
		
		getFillRadialGradientColorStops: function() {
			return this.attr.fillRadialGradientColorStops;
		},
		setFillRadialGradientColorStops: function(val) {
			this.attr.fillRadialGradientColorStops = val;
		},
		
		getFillPatternRepeat: function() {
			return this.attr.fillPatternRepeat;
		},
		setFillPatternRepeat: function(val) {
			this.attr.fillPatternRepeat = val;
		},
		
		isFillEnabled: function() {
			var val = this.attr.fillEnabled;
			return (!_.exists(val)) ? true : val;
		},
		setFillEnabled: function(val) {
			this.attr.fillEnabled = val;
		},
		
		getStrokeEnabled: function() {
			var val = this.attr.strokeEnabled;
			return (!_.exists(val)) ? true : val;
		},
		setStrokeEnabled: function(val) {
			this.attr.strokeEnabled = val;
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
		
		getDashArrayEnabled: function() {
			var val = this.attr.dashArrayEnabled;
			return (!_.exists(val)) ? true : val;
		},
		setDashArrayEnabled: function(val) {
			this.attr.dashArrayEnabled = val;
		},
		
		getFillPriority: function() {
			var val = this.attr.fillPriority;
			return (!_.exists(val)) ? 'color' : val;
		},
		setFillPriority: function(val) {
			this.attr.fillPriority = val;
		},
		
		getStrokeScaleEnabled: function() {
			var val = this.attr.strokeScaleEnabled;
			return (!_.exists(val)) ? true : val;
		},
		setStrokeScaleEnabled: function(val) {
			this.attr.strokeScaleEnabled = val;
		},
		
		getFillPatternRotation: function() { // radians
			var val = this.attr.fillPatternRotation;
			return (!_.exists(val)) ? 0 : val;
		},
		getFillPatternRotationDeg: function() { // degrees
			var val = this.attr.fillPatternRotation;
			return Gear.Math.radToDeg((!_.exists(val)) ? 0 : val);
		},
		setFillPatternRotation: function(val) { // radians
			this.attr.fillPatternRotation = val;
		},
		setFillPatternRotationDeg: function(deg) { // degrees
			this.attr.fillPatternRotation = Gear.Math.degToRad(deg);
		},
		
		getFillPatternOffset: function() {
			return this.attr.fillPatternOffset;
		},
		setFillPatternOffset: function(point) {
			if (!point) { return; }

			point = Gear.point.parse(point);
			this.setFillPatternOffsetX(point.x);
			this.setFillPatternOffsetY(point.y);
		},
		getFillPatternOffsetX: function() {
			var val = this.attr.fillPatternOffsetX;
			return (!_.exists(val)) ? 0 : val;
		},
		setFillPatternOffsetX: function(val) {
			this.attr.fillPatternOffsetX = val;
		},
		getFillPatternOffsetY: function() {
			var val = this.attr.fillPatternOffsetY;
			return (!_.exists(val)) ? 0 : val;
		},
		setFillPatternOffsetY: function(val) {
			this.attr.fillPatternOffsetY = val;
		},
		
		getFillPatternScale: function() {
			return this.attr.fillPatternScale;
		},
		setFillPatternScale: function(point) {
			if (!point) { return; }

			point = Gear.point.parse(point);
			this.setFillPatternScaleX(point.x);
			this.setFillPatternScaleY(point.y);
		},
		getFillPatternScaleX: function() {
			var val = this.attr.fillPatternScaleX;
			return (!_.exists(val)) ? 1 : val;
		},
		setFillPatternScaleX: function(val) {
			this.attr.fillPatternScaleX = val;
		},
		getFillPatternScaleY: function() {
			var val = this.attr.fillPatternScaleY;
			return (!_.exists(val)) ? 1 : val;
		},
		setFillPatternScaleY: function(val) {
			this.attr.fillPatternScaleY = val;
		},
		
		getFillLinearGradientStartPoint: function() {
			return this.attr.fillLinearGradientStartPoint;
		},
		setFillLinearGradientStartPoint: function(point) {
			if (!point) { return; }

			point = Gear.point.parse(point);
			this.setFillLinearGradientStartPointX(point.x);
			this.setFillLinearGradientStartPointY(point.y);
		},
		getFillLinearGradientStartPointX: function() {
			var val = this.attr.fillLinearGradientStartPointX;
			return (!_.exists(val)) ? 0 : val;
		},
		setFillLinearGradientStartPointX: function(val) {
			this.attr.fillLinearGradientStartPointX = val;
		},
		getFillLinearGradientStartPointY: function() {
			var val = this.attr.fillLinearGradientStartPointY;
			return (!_.exists(val)) ? 0 : val;
		},
		setFillLinearGradientStartPointY: function(val) {
			this.attr.fillLinearGradientStartPointY = val;
		},
		
		getFillLinearGradientEndPoint: function() {
			return this.attr.fillLinearGradientEndPoint;
		},
		setFillLinearGradientEndPoint: function(point) {
			if (!point) { return; }

			point = Gear.point.parse(point);
			this.setFillLinearGradientEndPointX(point.x);
			this.setFillLinearGradientEndPointY(point.y);
		},
		getFillLinearGradientEndPointX: function() {
			var val = this.attr.fillLinearGradientEndPointX;
			return (!_.exists(val)) ? 0 : val;
		},
		setFillLinearGradientEndPointX: function(val) {
			this.attr.fillLinearGradientEndPointX = val;
		},
		getFillLinearGradientEndPointY: function() {
			var val = this.attr.fillLinearGradientEndPointY;
			return (!_.exists(val)) ? 0 : val;
		},
		setFillLinearGradientEndPointY: function(val) {
			this.attr.fillLinearGradientEndPointY = val;
		},
		
		getFillRadialGradientStartPoint: function() {
			return this.attr.fillRadialGradientStartPoint;
		},
		setFillRadialGradientStartPoint: function(point) {
			if (!point) { return; }

			point = Gear.point.parse(point);
			this.setFillRadialGradientStartPointX(point.x);
			this.setFillRadialGradientStartPointY(point.y);
		},
		getFillRadialGradientStartPointX: function() {
			var val = this.attr.fillRadialGradientStartPointX;
			return (!_.exists(val)) ? 0 : val;
		},
		setFillRadialGradientStartPointX: function(val) {
			this.attr.fillRadialGradientStartPointX = val;
		},
		getFillRadialGradientStartPointY: function() {
			var val = this.attr.fillRadialGradientStartPointY;
			return (!_.exists(val)) ? 0 : val;
		},
		setFillRadialGradientStartPointY: function(val) {
			this.attr.fillRadialGradientStartPointY = val;
		},
		
		getFillRadialGradientEndPoint: function() {
			return this.attr.fillRadialGradientEndPoint;
		},
		setFillRadialGradientEndPoint: function(point) {
			if (!point) { return; }

			point = Gear.point.parse(point);
			this.setFillRadialGradientEndPointX(point.x);
			this.setFillRadialGradientEndPointY(point.y);
		},
		getFillRadialGradientEndPointX: function() {
			var val = this.attr.fillRadialGradientEndPointX;
			return (!_.exists(val)) ? 0 : val;
		},
		setFillRadialGradientEndPointX: function(val) {
			this.attr.fillRadialGradientEndPointX = val;
		},
		getFillRadialGradientEndPointY: function() {
			var val = this.attr.fillRadialGradientEndPointY;
			return (!_.exists(val)) ? 0 : val;
		},
		setFillRadialGradientEndPointY: function(val) {
			this.attr.fillRadialGradientEndPointY = val;
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