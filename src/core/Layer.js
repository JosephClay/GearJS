(function(Gear, Constants, Util) {

	/**
	 * Layers are tied to their own canvas element and are used to contain groups or shapes.
	 * @param {Object} config
	 */
	var Layer = function(config) {
		config = config || {};

		this.canvas = new Gear.SceneCanvas(config);
		this.hitCanvas = new Gear.HitCanvas(config);
		Gear.Container.call(this, config);

		this.nodeType = Constants.NODE_TYPE.LAYER;
	};

	Util.construct(Layer.prototype, Gear.Container.prototype, {
		
		auto: function() {
			var compose = this.compose.bind(this);
			this._tickId = Gear.Tick.subscribe('tick', compose);

			return this;
		},

		manual: function() {
			if (!this._tickId) { return; }
			Gear.Tick.unsubscribe('tick', this._tickId);
			this._tickId = null;

			return this;
		},

		add: function(child) {
			Gear.Container.prototype.add.call(this, child);

			// When an item is added, if we're not ticking
			// then we need to compose in order to display
			// the child
			if (!_.exists(this._tickId)) { this.compose(); }

			return this;
		},

		_validateAdd: function(child) {
			var type = child.getType();
			if (type === Constants.NODE_TYPE.STAGE || type === Constants.NODE_TYPE.LAYER) {
				throw new Error('Stages and layers cannot be added to a layer.');
			}
		},

		/**
		 * Get the intersection that contains a node and pixel data.
		 * @param  {Point} point
		 * @return {Object} { node, pixel }
		 */
		getIntersection: function(intersection) {
			if (!this.isVisible() || !this.isListening()) { return null; }

			var point = Gear.point.parse(intersection),
				p = this.hitCanvas.getContext().getImageData(point.x | 0, point.y | 0, 1, 1).data;

			// this indicates that a hit pixel may have been found
			if (p[3] === 255) {
				var colorKey = Gear.Color.rgbToHex(p[0], p[1], p[2]),
					node = Gear.Global.shapes[colorKey];
				return {
					node: node,
					pixel: p
				};
			}
			
			// if no node mapped to that pixel, return pixel array
			if (p[0] > 0 || p[1] > 0 || p[2] > 0 || p[3] > 0) {
				return { pixel: p };
			}

			return null;
		},

		// On a layer, intercept the draws to 
		// trigger events
		drawScene: function(canvas) {
			canvas = canvas || this.getCanvas();

			this.trigger('beforeDraw', this);

			if (this.getClearBeforeDraw()) {
				canvas.clear();
			}
			
			// Container's drawScene will draw the children
			Gear.Container.prototype.drawScene.call(this, canvas);

			this.trigger('draw', this);

			return this;
		},
		drawHit: function() {
			var canvas = this.getHitCanvas();

			if (this.getClearBeforeDraw()) {
				canvas.clear();
			}

			// Container's drawHit will draw the children
			Gear.Container.prototype.drawHit.call(this);
			
			return this;
		},

		getCanvas: function() {
			return this.canvas;
		},

		getHitCanvas: function() {
			return this.hitCanvas;
		},

		/**
		 * clear canvas tied to the layer
		 * @param {Array} [clip] clipping bounds
		 * @example layer.clear([0, 0, 100, 100])
		 */
		clear: function(clip) {
			this.getCanvas().clear(clip);
			return this;
		},

		/**
		 * Set the visibility of the layer. Hides and shows the canvas
		 * @param {Boolean} isVisible
		 */
		setVisible: function(isVisible) {
			Gear.Node.prototype.setVisible.call(this, isVisible);

			var canvas = this.getCanvas(),
				hitCanvas = this.getHitCanvas();
			
			if (isVisible) {
				canvas.getElem().style.display = 'block';
				hitCanvas.getElem().style.display = 'block';
			} else {
				canvas.getElem().style.display = 'none';
				hitCanvas.getElem().style.display = 'none';
			}

			return this;
		},

		/**
		 * Set the zIndex of the layer. Moves the canvas up and down the Stage
		 * @param {Number} idx
		 * @return {this}
		 */
		setZ: function(idx) {
			Gear.Node.prototype.setZ.call(this, idx);
			
			var stage = this.getStage();
			if (!stage) { return this; }
				
			stage.content.removeChild(this.getCanvas().getElem());

			if (idx < stage.getChildren().length - 1) {
				stage.content.insertBefore(this.getCanvas().getElem(), stage.getChildren()[idx + 1].getCanvas().getElem());
			} else {
				stage.content.appendChild(this.getCanvas().getElem());
			}

			return this;
		},

		/**
		 * Move the layer to top. Check to see if the node move in
		 * Stage's children is successfull before manipulating the DOM
		 * @return {this}
		 */
		moveToTop: function() {
			if (!Gear.Node.prototype.moveToTop.call(this)) { return this; }

			var stage = this.getStage();
			if (!stage) { return this; }
				
			var content = stage.getContent(),
				canvasElem = this.getCanvas().getElem();
			content.removeChild(canvasElem);
			content.appendChild(canvasElem);

			return this;
		},

		/**
		 * See moveToTop
		 */
		moveUp: function() {
			if (!Gear.Node.prototype.moveUp.call(this)) { return this; }

			var stage = this.getStage();
			if (!stage) { return this; }
					
			var content = stage.getContent(),
				canvasElem = this.getCanvas().getElem();
			content.removeChild(this.getCanvas().getElem());

			if (this.index < stage.getChildren().length - 1) {
				content.insertBefore(canvasElem, stage.getChildren()[this.index + 1].getCanvas().getElem());
			} else {
				content.appendChild(canvasElem);
			}

			return this;
		},

		/**
		 * See moveToTop
		 */
		moveDown: function() {
			if (!Gear.Node.prototype.moveDown.call(this)) { return this; }
			
			var stage = this.getStage();
			if (!stage) { return this; }

			var children = stage.getChildren(),
				content = stage.getContent(),
				canvasElem = this.getCanvas().getElem();
			content.removeChild(canvasElem);
			content.insertBefore(canvasElem, children[this.index + 1].getCanvas().getElem());

			return this;
		},

		/**
		 * See moveToTop
		 */
		moveToBottom: function() {
			if (!Gear.Node.prototype.moveToBottom.call(this)) { return this; }
			
			var stage = this.getStage();
			if (!stage) { return this; }
			
			var children = stage.getChildren(),
				content = stage.getContent(),
				canvasElem = this.getCanvas().getElem();
			content.removeChild(canvasElem);
			content.insertBefore(canvasElem, children[1].getCanvas().getElem());

			return this;
		},

		/**
		 * Layer is top level for a getLayer call
		 * @return {this}
		 */
		getLayer: function() {
			return this;
		},

		/**
		 * Remove the layer, which also removes the canvas
		 * @return {this}
		 */
		remove: function() {
			var stage = this.getStage(),
				canvas = this.getCanvas(),
				elem = canvas.getElem();
			
			Gear.Node.prototype.remove.call(this);

			if (stage && canvas && _.isInDocument(elem)) {
				stage.content.removeChild(elem);
			}

			return this;
		},

		/**
		 * Whether to clear the canvas before redrawing
		 * @return {Boolean}
		 */
		getClearBeforeDraw: function() {
			var val = this.attr.clearBeforeDraw;
			return (!_.exists(val)) ? true : val;
		},

		setClearBeforeDraw: function(val) {
			this.attr.clearBeforeDraw = !!val;
			return this;
		},

		toString: function() {
			return '[Layer]';
		}
	});

	Gear.Layer = Layer;

}(Gear, Gear.Constants, Gear.Util));
