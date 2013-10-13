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
				fill = shape.getFill();

			if (!fill || !fill.isEnabled()) { return; }

			context.save();

			if (!skipShadow && shape.hasShadow()) {
				this._applyShadow(shape);
			}

			fill.draw(this);

			context.restore();

			if (!skipShadow && shape.hasShadow()) {
				this.fill(shape, true);
			}
		},
		
		_stroke: function(shape, skipShadow) {
			var context = this.getContext(),
				stroke = shape.getStroke();

			if (!stroke) { return; }

			stroke.draw(this, shape);
		},
		
		_applyShadow: function(shape) {
			var shadow = shape.getShadow();

			if (!shadow || !shadow.isEnabled()) { return; }

			shadow.draw(this, shape);
		},

		toString: function() {
			return '[SceneCanvas]';
		}
	});

	Gear.SceneCanvas = SceneCanvas;
	
}(Gear, Gear.Util));