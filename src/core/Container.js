(function(Gear, Constants, Util) {
	
	/**
	 * Used to contain nodes or other containers
	 * @param {Object} config
	 */
	var Container = function(config) {
		this.children = new Gear.Collection();
		Gear.Node.call(this, config);
	};

	_.extend(Container.prototype, Gear.Node.prototype, {

		/**
		 * Add a child (or an array of children) to the container
		 * @param {Node || Array} child || children
		 * @return {this}
		 */
		add: function(child) {
			if (!child) { return this; }

			// Add an array of children
			if (_.isArray(child)) {
				var idx = 0, length = child.length;
				for (; idx < length; idx++) {
					this.add(child[idx]);
				}
				return this;
			}

			// Add a single child
			var children = this.getChildren();
			if (this._validateAdd) {
				this._validateAdd(child);
			}
			child.index = children.length;
			child.parent = this;
			children.push(child);
			this.trigger('add', child);

			return this;
		},

		/**
		 * Remove all children from the container
		 * @return {this}
		 */
		removeChildren: function() {
			var children = this.getChildren(),
				child;
			while (children.length) {
				child = children[0];
				if (child.hasChildren()) {
					child.removeChildren();
				}
				child.remove();
			}

			return this;
		},

		/**
		 * Destroy all children in the container
		 * @return {this}
		 */
		destroyChildren: function() {
			var children = this.getChildren();
			while (children.length) {
				children[0].destroy();
			}

			return this;
		},

		/**
		 * Determine if a node is a descendant of this container
		 * @param  {Node}  node
		 * @return {Boolean}
		 */
		isAncestorOf: function(node) {
			var parent = node.getParent();
			while (parent) {
				if (parent._id === this._id) { return true; }
				parent = parent.parent;
			}

			return false;
		},

		/**
		 * Clones the container
		 * @param  {Object} obj overriding attributes
		 * @return {Container}
		 */
		clone: function(obj) {
			var container = new Gear.Container(this.attr);
			container.attr = _.extend(container.attr, obj);
			this.getChildren().each(function(node) {
				container.add(node.clone());
			});
			return container;
		},

		/**
		 * Assign indices to the children
		 */
		setChildrenIndices: function() {
			var children = this.getChildren(),
				idx = 0, length = children.length;
			for (; idx < length; idx += 1) {
				children[idx].index = idx;
			}
		},

		/**
		 * Draw children into the scene
		 * @param  {canvas} canvas
		 * @return {this}
		 */
		drawScene: function(canvas) {
			var layer = this.getLayer(),
				clip = this.getClip(),
				hasClip = (clip.width && clip.height);

			if (!canvas && layer) {
				canvas = layer.getCanvas();
			}

			if (this.isVisible()) {
				if (hasClip) { canvas.clip(this); }
				this._drawChildrenScene(canvas);
			}

			return this;
		},
		_drawChildrenScene: function(canvas) {
			var children = this.getChildren(),
				idx = 0, length = children.length,
				child;
			for (; idx < length; idx += 1) {
				children[idx].__draw(canvas);
			}
		},

		/**
		 * Draw the children into the hit
		 * @return {[type]} [description]
		 */
		drawHit: function() {
			var hitCanvas;
			if (!this.shouldDrawHit()) { return this; }
			
			var clip = this.getClip(),
				hasClip = (clip.width && clip.height && this.nodeType !== Constants.NODE_TYPE.STAGE);

			if (hasClip) {
				hitCanvas = this.getLayer().getHitCanvas();
				hitCanvas.clip(this);
			}

			this._drawChildrenHit();

			if (hasClip) {
				hitCanvas.getContext().restore();
			}

			return this;
		},
		_drawChildrenHit: function() {
			var children = this.getChildren(),
				idx = 0, length = children.length;
			for (; idx < length; idx += 1) {
				children[idx].__hit();
			}
		},

		/**
		 * Get the container's clip
		 * @return {Object} { x, y, width, height }
		 */
		getClip: function() {
			var clip = this.attr.clip || (this.attr.clip = { x: 0, y: 0, width: 0, height: 0 });
			return clip;
		},

		/**
		 * Set the clip of the container
		 * @param {Plane} clip
		 */
		setClip: function(clip) {
			if (!clip) { return; }

			var plane = Gear.Plane(clip);
			this.attr.clip = plane.toObject();
			plane.destroy();
			return this;
		},

		/**
		 * Convert container into an object
		 * @return {Object} data
		 */
		toObject: function() {
			var data = Gear.Node.prototype.toObject.call(this);
			data.children = [];

			var children = this.getChildren(),
				idx = 0, length = children.length,
				child;
			for (; idx < length; idx += 1) {
				child = children[idx];
				data.children.push(child.toObject());
			}

			return data;
		},

		/**
		 * Destroy this container and all of its children
		 * @return {this}
		 */
		destroy: function() {
			if (!this.hasChildren()) { return; }
			this.destroyChildren();
			return this;
		},

		toString: function() {
			return '[Container]';
		}
	});

	Gear.Container = Container;

}(Gear, Gear.Constants, Gear.Util));