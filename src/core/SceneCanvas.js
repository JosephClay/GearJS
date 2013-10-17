(function(Gear, Util) {

	var SceneCanvas = function(config) {
		Gear.Canvas.call(this, config);
	};

	Util.construct(SceneCanvas.prototype, Gear.Canvas.prototype, {

		/**
		 * Fill a shape with a color or a fill object
		 * @param  {Shape} shape
		 * @param  {Boolean} skipShadow whether to skip shadow rendering
		 */
		_fill: function(shape, skipShadow) {
			var context = this.getContext(),
				fill = shape.getFill();

			if (!fill || !fill.isEnabled()) { return; }

			this.save();

			if (!skipShadow && shape.hasShadow()) {
				this._applyShadow(shape);
			}

			fill.draw(this);

			this.restore();

			if (!skipShadow && shape.hasShadow() && !shape.getShadow().isInset()) {
				this._fill(shape, true);
			}
		},
		
		_stroke: function(shape, skipShadow) {
			var context = this.getContext(),
				stroke = shape.getStroke();

			if (!stroke) { return; }

			this.save();

			if (!skipShadow && shape.hasShadow()) {
				this._applyShadow(shape);
			}

			stroke.draw(this);

			this.restore();

			if (!skipShadow && shape.hasShadow() && !shape.getShadow().isInset()) {
				this._stroke(shape, true);
			}
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