(function(Gear, Util) {

	var _animations = [],
		_animRunning = false,
		_id = 0; // Tick subscription id
	
	var _addAnimation = function(anim) {
		_animations.push(anim);
		_handleAnimation();
	};

	var _removeAnimation = function(anim) {
		var id = anim._id,
			idx = 0, length = _animations.length;
		for (; idx < length; idx += 1) {
			if (_animations[idx]._id === id) {
				_animations.splice(idx, 1);
				break;
			}
		}
	};

	var _runFrames = function() {
		if (!_animations.length) {
			_animRunning = false;
			Gear.Tick.unsubscribe('tick', _id);
			return;
		}
		
		// Loop through all animations and execute the
		// function. If the animation object has specified node,
		// we can add the node to the nodes hash to eliminate
		// drawing the same node multiple times. The node property
		// can be the stage itself or a layer.
		//
		// WARNING: Don't cache animations.length because it could 
		// (and often does) change while the for loop is running.
		var layerHash = {},
			idx = 0, anim;
		for (; idx < _animations.length; idx += 1) {
			anim = _animations[idx];

			anim._updateFrameObject(_.now());

			var layers = anim.layers,
				i = 0, layersLength = layers.length,
				layer;
			for (; i < layersLength; i += 1) {
				layer = layers[i];

				if (_.exists(layer._id)) {
					layerHash[layer._id] = layer;
				}
			}

			// if animation object has a function, execute it
			if (anim.func) {
				anim.func.call(anim, anim.frame);
			}
		}

		var key;
		for (key in layerHash) {
			layerHash[key].compose();
		}
	};

	var _handleAnimation = function() {
		if (_animRunning) { return; }
		_animRunning = true;

		_id = Gear.Tick.subscribe('tick', _runFrames);
	};

	var Animation = function(func, layers) {
		this._id = Gear.id('animation');

		this.animIdCounter = 0;
		this.func = func;
		this.setLayers(layers);
		this.frame = {
			time: 0,
			timeDiff: 0,
			lastTime: 0
		};
	};
	
	Animation.prototype = {

		/**
		 * Set layers to be redrawn on each animation frame
		 * @param {Gear.Layer|Gear.Collection|Array} layers
		 */
		setLayers: function(layers) {
			this.layers = (!layers) ? [] : (layers.length > 0) ? layers : [layers];
		},

		/**
		 * @return {Array} Gear.Layers
		 */
		getLayers: function() {
			return this.layers;
		},

		/**
		 * Add a layer to be redrawn on each animation frame
		 * @param {Gear.Layer} layer
		 */
		addLayer: function(layer) {
			if (!layer) { return; }
			this.layers.push(layer);
			return this;
		},

		/**
		 * determine if animation is running or not.
		 * @return {Boolean}
		 */
		isRunning: function() {
			var idx = 0, length = _animations.length;
			for (; idx < length; idx += 1) {
				if (_animations[idx]._id === this._id) {
					return true;
				}
			}
			return false;
		},

		start: function() {
			this.stop();
			this.frame.timeDiff = 0;
			this.frame.lastTime = _.now();
			_addAnimation(this);
		},

		stop: function() {
			_removeAnimation(this);
		},

		_updateFrameObject: function(time) {
			var frame = this.frame;

			frame.timeDiff = (time - frame.lastTime);
			frame.lastTime = time;
			frame.time += frame.timeDiff;
			frame.frameRate = (1000 / frame.timeDiff);
		},

		toString: function() {
			return '[Animation]';
		}
	};

	Gear.Animation = Animation;

}(Gear));