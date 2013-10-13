(function(Gear) {

	var Stroke = function(config) {
		this._isEnabled = _.isBoolean(config.isEnabled) ? config.isEnabled : true;
		this._width = _.isNumber(config.width) ? config.width : 1;
		this._style = config.style || 'black';
		this._dashArray = config.dashArray;
		this._scale = config.scale || { x: 1, y: 1 };
		this._lineCap = config.lineCap;
	};

	Stroke.prototype = {
		stroke: function(canvas, shape, skipShadow) {
			if (!this.isEnabled()) { return; }

			var context = canvas.getContext(),
				scale = this._scale,
				lineCap = this._lineCap,
				dashArray = this._dashArray,
				width = this._width,
				style = this._style;

			context.save();

			if (scale.x !== 1 || scale.y !== 1) {
				context.setTransform(1, 0, 0, 1, 0, 0);
			}

			if (lineCap) {
				context.lineCap = lineCap;
			}

			if (dashArray) {
				context.setLineDash(dashArray);
			}

			if (!skipShadow && shape.hasShadow()) {
				canvas.applyShadow(shape);
			}

			context.lineWidth = width;
			context.strokeStyle = style;
			context.stroke();

			context.restore();

			if (!skipShadow && shape.hasShadow()) {
				this.stroke(canvas, shape, true);
			}
		},

		isEnabled: function() {
			return this._isEnabled && (this._width > 0);
		},

		enable: function() {
			this._isEnabled = true;
		},

		disable: function() {
			this._isEnabled = false;
		}
	};

	Stroke.LINE_CAP = {
		butt: 'butt',
		round: 'round',
		square: 'square'
	};

	Stroke.LINE_JOIN = {
		miter: 'miter',
		round: 'round',
		bevel: 'bevel'
	};

	Gear.Stroke = Stroke;

}(Gear));