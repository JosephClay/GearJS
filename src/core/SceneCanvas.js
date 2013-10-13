(function(Gear, Util) {

	var SceneCanvas = function(config) {
		Gear.Canvas.call(this, config);
	};

	_.extend(SceneCanvas.prototype, Gear.Canvas.prototype, {

		/**
		 * Fill a shape with a color or a fill object
		 * @param  {Shape} shape
		 * @param  {Boolean} skipShadow whether to skip shadow rendering
		 */
		_fill: function(shape, skipShadow) {
			var context = this.getContext(),
				fill = shape.getFill(),
				isEnabled = fill ? fill.isEnabled() : false;

			if (!fill || !isEnabled) { return; }

			context.save();

			if (!skipShadow && shape.hasShadow()) {
				this._applyShadow(shape);
			}

			fill.fill(this);

			context.restore();

			if (!skipShadow && shape.hasShadow()) {
				this.fill(shape, true);
			}
		},
		
		_stroke: function(shape, skipShadow) {
			var context = this.getContext(),
				stroke = shape.getStroke();

			if (!stroke) { return; }

			stroke.stroke(this, shape);
		},
		
		_applyShadow: function(shape) {
			var context = this.getContext();

			if (!shape.hasShadow() && !shape.isShadowEnabled()) { return; }

			var absOpacity = shape.getAbsoluteOpacity(),
				shadow = shape.getShadow(),
				color = shadow.color || 'black',
				blur = shadow.blur || 5,
				opacity = shadow.opacity || 0,
				offset = shadow.offset;

			if (opacity) {
				context.globalAlpha = opacity * absOpacity;
			}

			context.shadowColor = color;
			context.shadowBlur = blur;
			context.shadowOffsetX = offset.x;
			context.shadowOffsetY = offset.y;
		},

		toString: function() {
			return '[SceneCanvas]';
		}
	});

	Gear.SceneCanvas = SceneCanvas;
	
}(Gear, Gear.Util));