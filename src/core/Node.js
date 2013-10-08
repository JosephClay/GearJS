(function(Gear, Constants, Util) {
	
	var _dummyFunction = function() {};

	/**
	 * Nodes are entities that can be transformed, layered, and have bound events.
	 * The stage, layers, groups, and shapes all extend Node.
	 * @param {Object} config
	 */
	var Node = function(config) {
		Gear.Signal.call(this);
		
		this._id = Gear.id('node');
		this._absTransform = new Gear.Transform();
		this._trans = new Gear.Transform();
		this.attr = _.extend({}, config);
		this.index = null;
		this.nodeType = Constants.NODE_TYPE.NODE;
		this.determineComposition();
	};

	_.extend(Node.prototype, Gear.Signal.prototype, {
		
		// At this point, we should know exactly how to draw this to the canvas.
		// - Give intercepting drawScene/drawHit functions priority, they're calling __draw on children
		// - Give the attribute priority to override an object defined function
		// - Object defined function (e.g. Rect.prototype.draw)
		// - If all else fails, use the dummy function. This prevents us from having to do existance
		//   checks on every object before rendering. Most (all) of the time, there will be a draw
		//   to call, so fore-go the checking.
		determineComposition: function() {
			this.__draw = this.drawScene || this.attr.draw || this.draw || _dummyFunction;
			this.__hit = this.drawHit || this.attr.hit || this.hit || _dummyFunction;
		},

		/**
		 * Returns a collection of children
		 * @return {Collection}
		 */
		getChildren: function() {
			return this.children;
		},

		/**
		 * Determine if children are present
		 * @return {Boolean}
		 */
		hasChildren: function() {
			var children = this.getChildren();
			return !!(children && children.length > 0);
		},
		
		/**
		 * Get a collection of parents of this node
		 * @return {Collection} ancestors
		 */
		getAncestors: function() {
			var parent = this.getParent(),
				ancestors = new Gear.Collection();

			while (parent) {
				ancestors.push(parent);
				parent = (parent && parent.getParent) ? parent.getParent() : null;
			}

			return ancestors;
		},

		/**
		 * Get the level of the node in the tree
		 * @return {Number} level
		 */
		getLevel: function() {
			var level = 0,
				parent = this.parent;

			while (parent) {
				level++;
				parent = parent.parent;
			}

			return level;
		},

		/**
		 * Move node to end of children
		 * @return {Bool} isSuccess
		 */
		moveToTop: function() {
			var parent = this.getParent();
			if (!parent) { return false; }

			var index = this.index;
			parent.children.splice(index, 1);
			parent.children.push(this);
			parent.setChildrenIndices();

			return true;
		},

		/**
		 * Increment node's index
		 * @return {Bool} isSuccess
		 */
		moveUp: function() {
			var parent = this.getParent();
			if (!parent) { return false; }

			var index = this.index,
				length = parent.getChildren().length;
			if (index < length - 1) {
				parent.children.splice(index, 1);
				parent.children.splice(index + 1, 0, this);
				parent.setChildrenIndices();
				return true;
			}

			return false;
		},

		/**
		 * Decrement node's index
		 * @return {Bool} isSuccess
		 */
		moveDown: function() {
			var parent = this.getParent();
			if (!parent) { return false; }

			var index = this.index;
			if (index > 0) {
				parent.children.splice(index, 1);
				parent.children.splice(index - 1, 0, this);
				parent.setChildrenIndices();
				return true;
			}

			return false;
		},

		/**
		 * Move node to begining of children
		 * @return {Bool} isSuccess
		 */
		moveToBottom: function() {
			var parent = this.getParent();
			if (!parent) { return false; }

			var index = this.index;
			if (index > 0) {
				this.parent.children.splice(index, 1);
				this.parent.children.unshift(this);
				this.parent.setChildrenIndices();
				return true;
			}

			return false;
		},

		/**
		 * Move node from one container to another
		 * @param  {Container} newContainer
		 * @return {this}
		 */
		moveTo: function(newContainer) {
			this.remove();
			newContainer.add(this);

			return this;
		},

		/**
		 * Convert node into an object
		 * @return {Object} data
		 */
		toObject: function() {
			var data = {},
				attr = this.attr,
				key, val;

			data.attr = {};

			// Serialize everything except: functions, images, DOM objects, or objects with methods
			for (key in attr) {
				val = attr[key];
				if (!_.isFunction(val) && !_.isElement(val) && !(_.isObject(val) && _.hasMethods(val))) {
					data.attr[key] = val;
				}
			}

			data._className = this._className;

			return data;
		},

		/**
		 * @return {Object}
		 */
		toJSON: function() {
			return this.toObject();
		},

		/**
		 * Get parent
		 */
		getParent: function() {
			return this.parent;
		},

		/**
		 * Get the parent layer
		 * @return {Layer}
		 */
		getLayer: function() {
			var parent = this.getParent();

			while (parent) {
				if (!parent) { break; }
				if (parent.getLayer) { return parent.getLayer(); }
				parent = parent.parent;
			}

			return null;
		},

		/**
		 * Get the parent context
		 * @return {context}
		 */
		getContext: function() {
			var stage = this.getStage();
			return stage ? stage.getContext() : null;
		},

		/**
		 * Get the parent canvas
		 * @return {canvas}
		 */
		getCanvas: function() {
			var stage = this.getStage();
			return stage ? stage.getCanvas() : null;
		},

		/**
		 * Gets the stage if present
		 * @return {Stage}
		 */
		getStage: function() {
			var parent = this.getParent();

			while (parent) {
				if (!parent) { break; }
				if (parent.getStage) { return parent.getStage(); }
				parent = parent.parent;
			}

			return null;
		},

		/**
		 * Get the transformation of the node. Takes into account ancestor transforms
		 * @return {Transform} absoluteTransform
		 */
		getAbsoluteTransform: function() {
			var absoluteTransform = this._absTransform.reset(),
				nodeTransform;

			var family = [this],
				parent = this.getParent();

			while (parent) {
				family.unshift(parent);
				parent = parent.parent;
			}

			var idx = 0, length = family.length;
			for (; idx < length; idx += 1) {
				node = family[idx];
				nodeTransform = node.getTransform();
				absoluteTransform.multiply(nodeTransform);
			}

			return absoluteTransform;
		},

		/**
		 * Get the transformation of the node
		 * @return {Transform} matrix
		 */
		getTransform: function() {
			var trans = this._trans.reset(),
				x = this.getX(),
				y = this.getY(),
				rotation = this.getRotation(),
				scaleX = this.getScale().x,
				scaleY = this.getScale().y,
				skewX = this.getSkew().x,
				skewY = this.getSkew().y,
				offsetX = this.getOffset().x,
				offsetY = this.getOffset().y;

			if (x !== 0 || y !== 0) {
				trans.translate(x, y);
			}

			if (skewX !== 0 || skewY !== 0) {
				trans.skew(skewX, skewY);
			}

			if (scaleX !== 1 || scaleY !== 1) {
				trans.scale(scaleX, scaleY);
			}

			if (offsetX !== 0 || offsetY !== 0) {
				trans.translate(offsetX * -1, offsetY * -1);
			}
			
			if (rotation !== 0) {
				trans.rotate(Gear.Math.degToRad(rotation));
			}

			return trans;
		},

		setTransform: function(trans) {
			// TODO: Set transform
		},

		clearTransform: function() {
			var transform = this.getTransform(),
				attr = this.attr;
			
			attr.x = 0;
			attr.y = 0;
			attr.rotation = 0;
			attr.scale.x = 1;
			attr.scale.y = 1;
			attr.offset.x = 0;
			attr.offset.y = 0;
			attr.skew.x = 0;
			attr.skew.y = 0;

			return transform;
		},

		/**
		 * Clones the node
		 * @param  {Object} obj overriding attributes
		 * @return {Node}
		 */
		clone: function(obj) {
			var node = new Gear[this.getClassName()](this.attr);
			node.attr = _.extend(node.attr, obj);
			return node;
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
		toDataURL: function(config) {
			config = config || {};

			var mimeType = config.mimeType || null,
				quality = config.quality || null,
				stage = this.getStage(),
				x = config.x || 0,
				y = config.y || 0,
				canvas = new Gear.SceneCanvas({
					width: config.width || stage.width,
					height: config.height || stage.height,
					pixelRatio: 1
				}),
				context = canvas.getContext();

			context.save();

			if (x || y) {
				context.translate(x * -1, y * -1);
			}

			this.__draw(canvas);
			context.restore();

			return canvas.toDataURL(mimeType, quality);
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
			Util.getImage(this.toDataURL(config), function(img) {
				config.callback(img);
			});
		},

		/**
		 * Gets class name from Constansts.NODE_NAME based on the node type
		 * @return {String} className e.g. 'Node', 'Stage', 'Layer' etc...
		 */
		getClassName: function() {
			return this._className || (this._className = Constants.NODE_NAME[this.nodeType]);
		},

		/**
		 * Get the node Type
		 * @return {Number} Constants.NODE_TYPE
		 */
		getType: function() {
			return this.nodeType;
		},

		/**
		 * Draw both scene and hit.
		 * @return {this}
		 */
		compose: function() {
			this.__draw();
			this.__hit();
			return this;
		},

		/**
		 * Whether the HitCanvas for this node should be drawn.
		 * Will be true if the node is visible and someone is listening
		 * @return {Boolean}
		 */
		shouldDrawHit: function() {
			return this.isListening() && this.isVisible();
		},

		getId: function() {
			return this.attr.id || '';
		},

		setId: function(id) {
			this.attr.id = id;
			return this;
		},

		getName: function() {
			return this.attr.name || '';
		},

		setName: function(name) {
			this.attr.name = name;
			return this;
		},

		getX: function() {
			var val = this.attr.x;
			return (!_.exists(val)) ? 0 : val;
		},

		setX: function(val) {
			this.attr.x = ~~val;
			return this;
		},

		getY: function() {
			var val = this.attr.y;
			return (!_.exists(val)) ? 0 : val;
		},

		setY: function(val) {
			this.attr.y = ~~val;
			return this;
		},

		getZ: function() {
			return this.index || 0;
		},
		getIndex: function() {
			return this.z;
		},

		setZ: function(idx) {
			idx = ~~idx;

			var index = this.index;
			this.parent.children.splice(index, 1);
			this.parent.children.splice(idx, 0, this);
			this.parent.setChildrenIndices();
			
			this.index = idx;
			return this;
		},
		setIndex: function(index) {
			this.setZ(index);
			return this;
		},

		getWidth: function() {
			return this.attr.width || 0;
		},

		setWidth: function(width) {
			this.attr.width = ~~width;
			return this;
		},

		getHeight: function() {
			return this.attr.height || 0;
		},

		setHeight: function(height) {
			this.attr.height = ~~height;
			return this;
		},

		/**
		 * Get the absolute opacity, which takes into account
		 * parent's opacity
		 * @return {Number}
		 */
		getAbsoluteOpacity: function() {
			var absOpacity = this.getOpacity(),
				parent = this.getParent();

			if (parent) {
				absOpacity *= parent.getAbsoluteOpacity();
			}

			return absOpacity;
		},

		getOpacity: function() {
			var val = this.attr.opacity;
			return (!_.exists(val)) ? 1 : val;
		},

		setOpacity: function(val) {
			this.attr.opacity = val;
			return this;
		},

		getListening: function() {
			return !!this.attr.listening;
		},

		setListening: function(isListening) {
			this.attr.listening = !!isListening;
			return this;
		},

		show: function() {
			this.setVisible(true);
			return this;
		},

		hide: function() {
			this.setVisible(false);
			return this;
		},

		getVisible: function() {
			var isVisible = this.attr.visible;
			return !_.exists(isVisible) ? true : !!isVisible;
		},

		setVisible: function(isVisible) {
			this.attr.visible = !!isVisible;
			return this;
		},

		getDraw: function() {
			return this.attr.draw;
		},

		setDraw: function(val) {
			this.attr.draw = _.isFunction(val) ? val : null;
			this.determineComposition();
			return this;
		},
		
		getHit: function() {
			return this.attr.hit;
		},

		setHit: function(val) {
			this.attr.hit = _.isFunction(val) ? val : null;
			this.determineComposition();
			return this;
		},

		/**
		 * Rotate around the x and y point
		 * @param  {[type]} deg [description]
		 * @return {[type]}     [description]
		 */
		rotation: function(deg) {
			this.setRotation(this.getRotation() + deg);
			return this;
		},

		getRotation: function() { // degrees
			var val = this.attr.rotation;
			return (!_.exists(val)) ? 0 : val;
		},

		setRotation: function(val) { // degrees
			this.attr.rotation = val;
			return this;
		},

		/**
		 * Rotate (not rotation) based on a pivot point
		 * @param  {Number} deg
		 * @return {this}
		 */
		rotate: function(deg) {
			this.setRotate(this.getRotate() + deg);
			return this;
		},
		
		getRotate: function() { // degrees
			var val = this.attr.rotate;
			return (!_.exists(val)) ? 0 : val;
		},

		setRotate: function(val) { // degrees
			this.attr.rotate = val;
			return this;
		},

		/**
		 * The point to use for rotate. Defaults
		 * to the center of the object. This is relative
		 * to the object's position.
		 * @return {Object} { x, y }
		 */
		getPivot: function() {
			var pivot = this.attr.pivot || (this.attr.pivot = {
				x: this.getWidth() / 2,
				y: this.getHeight() / 2
			});

			return pivot;
		},

		setPivot: function(point) {
			this.attr.pivot = Gear.point.parse(point);
			return this;
		},

		getScale: function() {
			var scale = this.attr.scale || (this.attr.scale = { x: 1, y: 1 });
			return scale;
		},

		setScale: function(point) {
			if (!point) { return; }

			point = Gear.point.parse(point);
			
			var scale = this.getScale();
			scale.x = point.x;
			scale.y = point.y;
			return this;
		},

		getSkew: function() {
			var skew = this.attr.skew || (this.attr.skew = { x: 0, y: 0 });
			return skew;
		},

		setSkew: function(point) {
			if (!point) { return; }

			point = Gear.point.parse(point);

			var skew = this.getSkew();
			skew.x = point.x;
			skew.y = point.y;
			return this;
		},

		getOffset: function() {
			var offset = this.attr.offset || (this.attr.offset = { x: 0, y: 0 });
			return offset;
		},

		setOffset: function(point) {
			if (!point) { return; }
		
			point = Gear.point.parse(point);
			
			var offset = this.getOffset();
			offset.x = point.x;
			offset.y = point.y;
			return this;
		},

		getSize: function() {
			return {
				width: this.getWidth(),
				height: this.getHeight()
			};
		},

		setSize: function(size) {
			if (!size) { return; }

			this.setWidth(size.width);
			this.setHeight(size.height);
			return this;
		},

		/**
		 * Move the node relative to its current position
		 * @param  {Point} point
		 * @return {this}
		 */
		move: function(point) {
			if (!point) { return this; }

			point = Gear.point.parse(point);

			var x = this.getX(),
				y = this.getY();

			this.setPosition({
				x: (x += point.x),
				y: (y += point.y)
			});

			return this;
		},

		getPosition: function() {
			return {
				x: this.getX(),
				y: this.getY()
			};
		},

		setPosition: function(point) {
			if (!point) { return; }

			point = Gear.point.parse(point);

			this.setX(point.x);
			this.setY(point.y);
			return this;
		},       

		/**
		 * Determine if node is listening for events. The node is listening only
		 * if it is listening and its parents are listening
		 * @return {Boolean}
		 */
		isListening: function() {
			var nodeIsListening = this.getListening(),
				parent = this.getParent();

			if (!nodeIsListening) { return false; }
			if (parent && !parent.isListening()) { return false; }

			return true;
		},

		/**
		 * Determine if node is visible or not. The node is visible only
		 * if it is visible and its parents are visible
		 * @return {Boolean}
		 */
		isVisible: function() {
			var nodeIsVisible = this.getVisible(),
				parent = this.getParent();

			if (!nodeIsVisible) { return false; }
			if (parent && !parent.isVisible()) { return false; }

			return true;
		},

		/**
		 * Remove the node from the parent
		 * @return {this}
		 */
		remove: function() {
			var parent = this.getParent();
				children = parent ? parent.getChildren() : null;

			if (parent && children) {
				children.splice(this.index, 1);
				parent.setChildrenIndices();
				this.parent = null;
			}

			return this;
		},
		
		/**
		 * Destroy this node
		 * @return {this}
		 */
		destroy: function() {
			this.remove();
			return this;
		},

		toString: function() {
			return '[Node]';
		}
	});
	
	Gear.Node = Node;
	
}(Gear, Gear.Constants, Gear.Util));