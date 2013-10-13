(function(Gear) {

	var Stroke = function(config) {
		this._isEnabled = _.isBoolean(config.isEnabled) ? config.isEnabled : true;
		this._width = _.isNumber(config.width) ? config.width : Stroke.defaults.width;
		this._style = config.style || Stroke.defaults.style;
		this._dashArray = config.dashArray;
		this._scale = config.scale || _.extend({}, Stroke.defaults.scale);
		this._lineCap = config.lineCap;
	};

	Stroke.defaults = {
		width: 1,
		style: '#000000',
		scale: { x: 1, y: 1 }
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

	Stroke.prototype = {
		draw: function(canvas, shape, skipShadow) {
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

			if (dashArray && context.setLineDash) {
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
		},

		getWidth: function() {
			return this._width;
		},
		setWidth: function(width) {
			this._width = width;
			return this;
		},

		getStyle: function() {
			return this._style;
		},
		setStyle: function(style) {
			this._style = style;
			return this;
		},

		getDashArray: function() {
			return this._dashArray;
		},
		setDashArray: function(arr) {
			this._dashArray = arr;
			return this;
		},

		getScale: function() {
			return this._scale;
		},
		setScale: function(scale) {
			this._scale = Gear.point.parse(scale);
			return this;
		},

		getLineCap: function() {
			return this._lineCap;
		},
		setLineCap: function(cap) {
			this._lineCap = cap;
			return this;
		},

		toJSON: function() {
			return {
				isEnabled: this._isEnabled,
				width: this._width,
				style: this._style,
				dashArray: this._dashArray,
				scale: this._scale,
				lineCap: this._lineCap
			};
		},

		toString: function() {
			return '[Stroke]';
		}
	};

	Gear.Stroke = Stroke;

}(Gear));