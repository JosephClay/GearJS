(function(Gear, Global, Constants) {

	var _pixelRatio = (function() {
		var canvas = _.element(Constants.CANVAS),
			context = canvas.getContext(Constants.CONTEXT_2D),
			devicePixelRatio = Global.WIN.devicePixelRatio || 1,
			backingStoreRatio = context.webkitBackingStorePixelRatio      ||
										context.mozBackingStorePixelRatio ||
										context.msBackingStorePixelRatio  ||
										context.oBackingStorePixelRatio   ||
										context.backingStorePixelRatio    ||
										1;
		return (devicePixelRatio / backingStoreRatio);
	}());

	var Canvas = function(config) {
		config = config || {};
		Gear.Node.call(this, config);

		this._contextType = config.contextType || Constants.CONTEXT_2D;
		this._pixelRatio = config.pixelRatio || _pixelRatio;
		this._saveCounter = 0;
		this.elem = _.element(Constants.CANVAS, {
			className: Constants.CANVAS_CLASS + ' ' + (config.className || '')
		});

		this.setContext(this.elem);
		this.setSize(config);
	};

	_.extend(Canvas.prototype, Gear.Node.prototype, {

		reset: function() {
			var pxRatio = this.getPixelRatio();
			this.getContext().setTransform(pxRatio, 0, 0, pxRatio, 0, 0);
		},

		getElem: function() {
			return this.elem;
		},

		getContext: function() {
			return this.context;
		},

		setContext: function(elem) {
			elem = elem || this.elem;
			this.context = elem.getContext(this._contextType);
		},

		save: function() {
			this._saveCounter += 1;
			if (this._saveCounter > 1) { return this; }
			
			this.getContext().save();
			return this;
		},

		restore: function() {
			this._saveCounter -= 1;
			if (this._saveCounter !== 0) { return this; }

			this.getContext().restore();
			return this;
		},

		clear: function(clip) {
			var context = this.getContext(),
				plane;

			if (clip) {
				plane = Gear.Plane(clip);
				context.clearRect(plane.x, plane.y, plane.width, plane.height);
				plane.destroy();
			} else {
				context.clearRect(0, 0, this.getWidth(), this.getHeight());
			}
		},

		/**
		 * Creates a data URL for the image of the defined area
		 * @param {Object} config
		 * @param {Function} config.callback function executed when the composite has completed
		 * @param {String} [config.mimeType] can be 'image/png' or 'image/jpeg'. 'image/png' is the default
		 * @param {Number} [config.x] x position of canvas section
		 * @param {Number} [config.y] y position of canvas section
		 * @param {Number} [config.width] width of canvas section
		 * @param {Number} [config.height] height of canvas section
		 * @param {Number} [config.quality] jpeg quality (if 'image/jpeg' mimeType). 0 low, 1 high.
		 */
		toDataURL: function(mimeType, quality) {
			return this.elem.toDataURL(mimeType, quality);
		},

		/**
		 * Fill and stroke a shape
		 * @param  {Shape} shape
		 */
		fillAndStroke: function(shape) {
			this._fill(shape);
			this._stroke(shape, shape.hasShadow() && shape.hasFill());
		},

		applyOpacity: function(shape) {
			var absOpacity = shape.getAbsoluteOpacity();
			if (absOpacity !== 1) {
				this.getContext().globalAlpha = absOpacity;
			}
		},

		applyLineJoin: function(shape) {
			var lineJoin = shape.getLineJoin();
			if (lineJoin) {
				this.getContext().lineJoin = lineJoin;
			}
		},

		applyAncestorTransforms: function(node) {
			var matrix = node.getAbsoluteTransform().getMatrix(),
				context = this.getContext();

			context.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
		},

		applyRotation: function(node) {
			var context = this.getContext(),
				rotate = node.getRotate();
			// After matrix transformations are applied
			// rotate around a pivot point
			if (rotate) {
				var pivot = node.getPivot();
				if (pivot.x !== 0 && pivot.y !== 0) {
					// The node is rotating around a point and not
					// using the matrix transformation. Instead the context
					// is translated and rotated the appropriate amount
					context.translate(pivot.x, pivot.y);
					context.rotate(Gear.Math.degToRad(rotate));
					context.translate(pivot.x * -1, pivot.y * -1);
				}
			}
		},

		clip: function(container) {
			var context = this.getContext(),
				clip = container.getClip();

			this.applyAncestorTransforms(container);
			context.beginPath();
			context.rect(clip.x, clip.y, clip.width, clip.height);
			context.clip();
			this.reset();
		},
	
		/*
		 * Gear automatically handles pixel ratio adustments. Unless otherwise
		 * specificed, the pixel ratio will be defaulted to the actual device pixel ratio.
		 * You can override the device pixel ratio for special situations, or, if you don't
		 * want the pixel ratio to be taken into account, you can set it to 1.
		 */
		getPixelRatio: function() {
			return this._pixelRatio;
		},

		/**
		 * Manually set the pixel ratio
		 * @param {Number} pixelRatio
		 */
		setPixelRatio: function(pixelRatio) {
			this._pixelRatio = pixelRatio;
			this.setSize({ width: this.width, height: this.height });
		},

		setWidth: function(width) {
			width = width || 0;
			// take into account pixel ratio
			this.attr.width = this.elem.width = (width * this.getPixelRatio());
			this.elem.style.width = _.toPx(width);
			var pixelRatio = this.getPixelRatio();
			this.context.scale(pixelRatio, pixelRatio);
		},

		setHeight: function(height) {
			height = height || 0;
			// take into account pixel ratio
			this.attr.height = this.elem.height = (height * this.getPixelRatio());
			this.elem.style.height = _.toPx(height);
			var pixelRatio = this.getPixelRatio();
			this.context.scale(pixelRatio, pixelRatio);
		},

		toString: function() {
			return '[Canvas]';
		}
	});

	Gear.Canvas = Canvas;

}(Gear, Gear.Global, Gear.Constants));
