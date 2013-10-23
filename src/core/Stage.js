(function(Gear, Constants, Global, Util) {

	var _isInDoubleClickTimeWindow = false,
		_doubleClickDelay = 400,
		_events = [
			Constants.EVT.MOUSEDOWN,
			Constants.EVT.MOUSEMOVE,
			Constants.EVT.MOUSEUP,
			Constants.EVT.MOUSEOUT,
			Constants.EVT.TOUCHSTART,
			Constants.EVT.TOUCHMOVE,
			Constants.EVT.TOUCHEND,
			Constants.EVT.MOUSEOVER
		],
		_eventsLength = _events.length;

	var _addEvent = function(context, eventName) {
		context.getContent().addEventListener(eventName, function(evt) {
			context['_' + eventName].call(context, evt);
		}, false);
	};

	var _ensureContainer = function(container) {
		container = _.isString(container) ? Global.DOC.getElementById(container) : container;
		if (!container) { container = _.element('div'); }
		return container;
	};

	// A stage is used to contain multiple layers
	var Stage = function(config) {
		config = _.extend({}, this.defaults, config);
		config.container = _ensureContainer(config.container);

		Gear.Container.call(this, config);
		this.nodeType = Constants.NODE_TYPE.STAGE;
		this._id = Gear.id('stage');
		this._buildDOM();
		this._bindContentEvents();
		Global.stages.push(this);
	};

	Stage.extend = Util.extend;

	Util.construct(Stage.prototype, Gear.Container.prototype, {
		_validateAdd: function(child) {
			if (child.getType() !== Constants.NODE_TYPE.LAYER) {
				throw new Error('Only layers may be added to the stage.');
			}
		},

		getContainer: function() {
			return this.attr.container;
		},

		setHeight: function(height) {
			Gear.Node.prototype.setHeight.call(this, height);
			this._resizeElem();
			return this;
		},

		setWidth: function(width) {
			Gear.Node.prototype.setWidth.call(this, width);
			this._resizeElem();
			return this;
		},

		clear: function() {
			var layers = this.children,
				idx = 0, length = layers.length;

			for (; idx < length; idx += 1) {
				layers[idx].clear();
			}
			return this;
		},

		destroy: function() {
			Gear.Container.prototype.destroy.call(this);

			var content = this.content;
			if (content && _.isInDocument(content)) {
				this.getContainer().removeChild(content);
			}

			this.content = null;
			this.attr.container = null;
		},

		getMousePosition: function() {
			return this.mousePos;
		},

		getTouchPosition: function() {
			return this.touchPos;
		},

		getPointerPosition: function() {
			return this.getTouchPosition() || this.getMousePosition();
		},

		/**
		 * Stage is top level for a getStage call.
		 * @return {this} stage
		 */
		getStage: function() {
			return this;
		},

		/**
		 * Gets the nested div surrounding the canvas element
		 * @return {Element} content
		 */
		getContent: function() {
			return this.content;
		},

		/**
		 * Creates a data URL for the image of the defined area
		 * @param {Object} config
		 * @param {Function} config.callback function executed when the composite has completed
		 * @param {String} [config.mimeType] can be 'image/png' or 'image/jpeg'. 'image/png' is the default
		 * @param {Number} [config.x] x
		 * @param {Number} [config.y] y
		 * @param {Number} [config.width] width
		 * @param {Number} [config.height] height
		 * @param {Number} [config.quality] jpeg quality (if 'image/jpeg' mimeType). 0 low, 1 high.
		 */
		toDataURL: function(config) {
			config = config || {};

			var mimeType = config.mimeType || null,
				quality = config.quality || null,
				x = config.x || 0,
				y = config.y || 0,
				canvas = new Gear.SceneCanvas({
					width: config.width || this.getWidth(),
					height: config.height || this.getHeight(),
					pixelRatio: 1
				}),
				context = canvas.getContext(),
				layers = this.children;

			if (x || y) {
				context.translate(x * -1, y * -1);
			}

			var drawLayer = function drawLayer(idx) {
				var layer = layers[idx];
				if (!layer) {
					config.callback(canvas.toDataURL(mimeType, quality));
					return;
				}
				
				var layerUrl = layer.toDataURL(),
					imageObj = new Image();
				imageObj.onload = function() {
					context.drawImage(imageObj, 0, 0);

					if (idx < (layers.length - 1)) {
						drawLayer(idx + 1);
					} else {
						config.callback(canvas.toDataURL(mimeType, quality));
					}
				};
				imageObj.src = layerUrl;
			};

			drawLayer(0);
		},

		/**
		 * Creates an image from the defined area
		 * @param {Object} config
		 * @param {Function} config.callback function executed when the composite has completed
		 * @param {String} [config.mimeType] can be 'image/png' or 'image/jpeg'. 'image/png' is the default
		 * @param {Number} [config.x] x
		 * @param {Number} [config.y] y
		 * @param {Number} [config.width] width
		 * @param {Number} [config.height] height
		 * @param {Number} [config.quality] jpeg quality (if 'image/jpeg' mimeType). 0 low, 1 high.
		 */
		toImage: function(config) {
			var callback = config.callback;

			config.callback = function(dataUrl) {
				Util.getImage(dataUrl, function(img) {
					callback(img);
				});
			};
			this.toDataURL(config);
		},

		/**
		 * Get the intersection that contains a node and pixel data.
		 * @param  {Point} point
		 * @return {Object} { node, pixel }
		 */
		getIntersection: function(point) {
			point = Gear.point.parse(point);

			var layers = this.getChildren(),
				idx = layers.length - 1,
				node;

			for (; idx >= 0; idx -= 1) {
				node = layers[idx].getIntersection(point);
				if (node) { return node; }
			}

			return null;
		},

		_resizeElem: function() {
			if (!this.content) { return; }

			var width = this.getWidth() || 0,
				height = this.getHeight() || 0,
				layers = this.getChildren(),
				idx = 0, length = layers.length,
				layer;

			// set content dimensions
			this.content.style.width = _.toPx(width);
			this.content.style.height = _.toPx(height);

			var dimensions = { width: width, height: height };
			this.sceneCanvas.setSize(dimensions);
			this.hitCanvas.setSize(dimensions);
		},

		// add layer to stage
		add: function(layer) {
			Gear.Container.prototype.add.call(this, layer);
			
			var dimensions = { width: this.getWidth(), height: this.getHeight() };
			layer.canvas.setSize(dimensions);
			layer.hitCanvas.setSize(dimensions);

			// draw layer and append canvas to container
			layer.compose();
			this.content.appendChild(layer.canvas.getElem());

			return this;
		},

		getParent: function() {
			return null;
		},

		getLayer: function() {
			return null;
		},

		// returns a Gear.Collection of layers
		getLayers: function() {
			return this.getChildren();
		},

		_setPointerPosition: function(evt) {
			if (!evt) {
				evt = Global.WIN.event;
			}
			this._setMousePosition(evt);
			this._setTouchPosition(evt);
		},
		
		_bindContentEvents: function() {
			var idx = 0;
			for (; idx < _eventsLength; idx += 1) {
				_addEvent(this, _events[idx]);
			}
		},
		
		_mouseover: function(evt) {
			this.trigger(Constants.EVT.MOUSEOVER, evt);
		},

		_mouseout: function(evt) {
			this._setPointerPosition(evt);
			
			var targetNode = this.targetNode;
			if (targetNode) {
				targetNode.triggerAndBubble(Constants.EVT.MOUSEOUT, evt);
				targetNode.triggerAndBubble(Constants.EVT.MOUSELEAVE, evt);
				this.targetNode = null;
			}
			this.mousePos = null;

			this.trigger(Constants.EVT.MOUSEOUT, evt);
		},

		_mousemove: function(evt) {
			// always call preventDefault for desktop events because some browsers
			// try to drag and drop the canvas element
			if (evt.preventDefault) { evt.preventDefault(); }
			
			this._setPointerPosition(evt);

			var result = this.getIntersection(this.getPointerPosition());
			if (result) {
				var node = result.node;
				if (node) {
					if (result.pixel[3] === 255 && (!this.targetNode || this.targetNode._id !== node._id)) {
						if (this.targetNode) {
							this.targetNode.triggerAndBubble(Constants.EVT.MOUSEOUT, evt, node);
							this.targetNode.triggerAndBubble(Constants.EVT.MOUSELEAVE, evt, node);
						}
						node.triggerAndBubble(Constants.EVT.MOUSEOVER, evt, this.targetNode);
						node.triggerAndBubble(Constants.EVT.MOUSEENTER, evt, this.targetNode);
						this.targetNode = node;
					} else {
						node.triggerAndBubble(Constants.EVT.MOUSEMOVE, evt);
					}
				}
			} else {
				// if no node was detected, clear target node and try
				// to run mouseout from previous target node
				this.trigger(Constants.EVT.MOUSEMOVE, evt);
				if (this.targetNode) {
					this.targetNode.triggerAndBubble(Constants.EVT.MOUSEOUT, evt);
					this.targetNode.triggerAndBubble(Constants.EVT.MOUSELEAVE, evt);
					this.targetNode = null;
				}
			}
		},

		_mousedown: function(evt) {
			// always call preventDefault for desktop events because some browsers
			// try to drag and drop the canvas element
			if (evt.preventDefault) { evt.preventDefault(); }
			
			this._setPointerPosition(evt);
			
			var result = this.getIntersection(this.getPointerPosition()),
				node = (result && result.node) ? result.node : this;

			Constants.LISTEN_TO_CLICK_OR_TAP = true;
			this.clickStartNode = node;
			node.triggerAndBubble(Constants.EVT.MOUSEDOWN, evt);
		},

		_mouseup: function(evt) {
			// always call preventDefault for desktop events because some browsers
			// try to drag and drop the canvas element
			if (evt.preventDefault) { evt.preventDefault(); }
			
			this._setPointerPosition(evt);

			var result = this.getIntersection(this.getPointerPosition()),
				node = (result && result.node) ? result.node : this;

			node.triggerAndBubble(Constants.EVT.MOUSEUP, evt);

			// detect if click or double click occurred
			if (Constants.LISTEN_TO_CLICK_OR_TAP && node._id === this.clickStartNode._id) {
				node.triggerAndBubble(Constants.EVT.CLICK, evt);

				if (_isInDoubleClickTimeWindow) {
					node.triggerAndBubble(Constants.EVT.DBL_CLICK, evt);
					_isInDoubleClickTimeWindow = false;
				} else {
					_isInDoubleClickTimeWindow = true;
				}

				setTimeout(function() {
					_isInDoubleClickTimeWindow = false;
				}, _doubleClickDelay);
			}

			Constants.LISTEN_TO_CLICK_OR_TAP = false;
		},

		_touchstart: function(evt) {
			// only call preventDefault if the node is listening for events
			if (evt.preventDefault && node.isListening()) { evt.preventDefault(); }
			
			this._setPointerPosition(evt);

			var result = this.getIntersection(this.getPointerPosition()),
				node = (result && result.node) ? result.node : this;

			Constants.LISTEN_TO_CLICK_OR_TAP = true;
			this.tapStartNode = node;
			node.triggerAndBubble(Constants.EVT.TOUCHSTART, evt);
		},

		_touchend: function(evt) {
			// only call preventDefault if the node is listening for events
			if (evt.preventDefault && node.isListening()) { evt.preventDefault(); }
			
			this._setPointerPosition(evt);
			
			var result = this.getIntersection(this.getPointerPosition()),
				node = (result && result.node) ? result.node : this;

			node.triggerAndBubble(Constants.EVT.TOUCHEND, evt);

			// detect if tap or double tap occurred
			if (Constants.LISTEN_TO_CLICK_OR_TAP && node._id === this.tapStartNode._id) {
				node.triggerAndBubble(Constants.EVT.TAP, evt);

				if (_isInDoubleClickTimeWindow) {
					node.triggerAndBubble(Constants.EVT.DBL_TAP, evt);
					_isInDoubleClickTimeWindow = false;
				} else {
					_isInDoubleClickTimeWindow = true;
				}

				setTimeout(function() {
					_isInDoubleClickTimeWindow = false;
				}, _doubleClickDelay);
			}

			Constants.LISTEN_TO_CLICK_OR_TAP = false;
		},

		_touchmove: function(evt) {
			// only call preventDefault if the node is listening for events
			if (evt.preventDefault && node.isListening()) { evt.preventDefault(); }
			
			this._setPointerPosition(evt);
			
			var result = this.getIntersection(this.getPointerPosition()),
				node = (result && result.node) ? result.node : this;

			node.triggerAndBubble(Constants.EVT.TOUCHMOVE, evt);
		},

		_setMousePosition: function(evt) {
			var mouseX = _.exists(evt.offsetX) ? evt.offsetX : evt.layerX || (evt.clientX - this._getContentPosition().left),
				mouseY = _.exists(evt.offsetY) ? evt.offsetY : evt.layerY || (evt.clientY - this._getContentPosition().top);
				
			this.mousePos = {
				x: mouseX,
				y: mouseY
			};
		},

		_setTouchPosition: function(evt) {
			var touch, touchX, touchY;

			if (_.exists(evt.touches) && (evt.touches.length === 1)) {
				// one finger
				touch = evt.touches[0];

				// get the information for finger #1
				touchX = touch.clientX - this._getContentPosition().left;
				touchY = touch.clientY - this._getContentPosition().top;

				this.touchPos = {
					x: touchX,
					y: touchY
				};
			}
		},

		_getContentPosition: function() {
			var rect = this.content.getBoundingClientRect();
			return {
				top: rect.top,
				left: rect.left
			};
		},

		_buildDOM: function() {
			var container = this.getContainer();

			// clear content inside container
			container.innerHTML = '';

			// content
			this.content = _.element('div', {
				className: Constants.STAGE_CLASS
			});
			container.appendChild(this.content);

			this.sceneCanvas = new Gear.SceneCanvas();
			this.hitCanvas = new Gear.HitCanvas();

			this._resizeElem();
		},

		_onContent: function(typesStr, handler) {
			var types = typesStr.split(' '),
				idx = 0, length = types.length, baseEvent;
			for (; idx < length; idx += 1) {
				baseEvent = types[idx];
				this.content.addEventListener(baseEvent, handler, false);
			}
		},

		toString: function() {
			return '[Stage]';
		}
	});

	Gear.Stage = Stage;

}(Gear, Gear.Const, Gear.Global, Gear.Util));
