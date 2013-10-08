(function(Gear, Util) {

	var SceneCanvas = function(config) {
		Gear.Canvas.call(this, config);
	};

	_.extend(SceneCanvas.prototype, Gear.Canvas.prototype, {

		fillPattern: function(shape) {
			var context = this.context,
				fillPatternImage = shape.getFillPatternImage(),
				fillPatternX = shape.getFillPatternX(),
				fillPatternY = shape.getFillPatternY(),
				fillPatternScale = shape.getFillPatternScale(),
				fillPatternRotation = shape.getFillPatternRotation(),
				fillPatternOffset = shape.getFillPatternOffset(),
				fillPatternRepeat = shape.getFillPatternRepeat();

			if (fillPatternX || fillPatternY) {
				context.translate(fillPatternX || 0, fillPatternY || 0);
			}
			if (fillPatternRotation) {
				context.rotate(fillPatternRotation);
			}
			if (fillPatternScale) {
				context.scale(fillPatternScale.x, fillPatternScale.y);
			}
			if (fillPatternOffset) {
				context.translate(fillPatternOffset.x * -1, fillPatternOffset.y * -1);
			}

			context.fillStyle = context.createPattern(fillPatternImage, fillPatternRepeat || 'repeat');
			context.fill();
		},

		fillLinearGradient: function(shape) {
			var context = this.context,
				start = shape.getFillLinearGradientStartPoint(),
				end = shape.getFillLinearGradientEndPoint(),
				colorStops = shape.getFillLinearGradientColorStops(),
				grad = context.createLinearGradient(start.x, start.y, end.x, end.y);

			if (colorStops) {
				this._buildColorStops(grad, colorStops);

				context.fillStyle = grad;
				context.fill();
			}
		},

		fillRadialGradient: function(shape) {
			var context = this.context,
			start = shape.getFillRadialGradientStartPoint(),
			end = shape.getFillRadialGradientEndPoint(),
			startRadius = shape.getFillRadialGradientStartRadius(),
			endRadius = shape.getFillRadialGradientEndRadius(),
			colorStops = shape.getFillRadialGradientColorStops(),
			grad = context.createRadialGradient(start.x, start.y, startRadius, end.x, end.y, endRadius);

			this._buildColorStops(grad, colorStops);

			context.fillStyle = grad;
			context.fill();
		},

		_buildColorStops: function(grad, colorStops) {
			var idx = 0, length = colorStops.length;
			for (; idx < length; idx += 2) {
				grad.addColorStop(colorStops[idx], colorStops[idx + 1]);
			}
		},

		fill: function(shape, skipShadow) {
			var context = this.context,
				hasColor = shape.getFill(),
				hasPattern = shape.getFillPatternImage(),
				hasLinearGradient = shape.getFillLinearGradientColorStops(),
				hasRadialGradient = shape.getFillRadialGradientColorStops(),
				fillPriority = shape.getFillPriority();

			context.save();

			if (!skipShadow && shape.hasShadow()) {
				this._applyShadow(shape);
			}

			// priority fills
			if (hasColor && fillPriority === 'color') {
				this.fillColor(shape);
			} else if (hasPattern && fillPriority === 'pattern') {
				this.fillPattern(shape);
			} else if (hasLinearGradient && fillPriority === 'linear-gradient') {
				this.fillLinearGradient(shape);
			} else if (hasRadialGradient && fillPriority === 'radial-gradient') {
				this.fillRadialGradient(shape);
			} else if (hasColor) { // now just try and fill with whatever is available
				this.fillColor(shape);
			} else if (hasPattern) {
				this.fillPattern(shape);
			} else if (hasLinearGradient) {
				this.fillLinearGradient(shape);
			} else if (hasRadialGradient) {
				this.fillRadialGradient(shape);
			}
			context.restore();

			if (!skipShadow && shape.hasShadow()) {
				this.fill(shape, true);
			}
		},
		
		fillColor: function(shape) {
			var context = this.context, fill = shape.getFill();
			context.fillStyle = fill;
			context.fill();
		},
		
		stroke: function(shape, skipShadow) {
			var context = this.context,
				stroke = shape.getStroke(),
				strokeWidth = shape.getStrokeWidth(),
				dashArray = shape.getDashArray();

			if (stroke || strokeWidth) {
				context.save();
				if (!shape.getStrokeScaleEnabled()) {

					context.setTransform(1, 0, 0, 1, 0, 0);
				}
				this._applyLineCap(shape);
				if (dashArray && shape.getDashArrayEnabled()) {
					if (context.setLineDash) {
						context.setLineDash(dashArray);
					}
				}
				if (!skipShadow && shape.hasShadow()) {
					this._applyShadow(shape);
				}
				context.lineWidth = strokeWidth || 2;
				context.strokeStyle = stroke || 'black';
				context.stroke();
				context.restore();

				if (!skipShadow && shape.hasShadow()) {
					this.stroke(shape, true);
				}
			}
		},
		
		_applyShadow: function(shape) {
			var context = this.context;

			if (shape.hasShadow() && shape.isShadowEnabled()) {
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
			}
		},

		toString: function() {
			return '[SceneCanvas]';
		}
	});

	Gear.SceneCanvas = SceneCanvas;
	
}(Gear, Gear.Util));