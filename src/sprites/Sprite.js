(function(Gear) {
		
	/**
	 * Displays frames or sequences of frames (ie. animations) from a sprite sheet image. A sprite sheet is a series of
	 * images (usually animation frames) combined into a single image. For example, an animation consisting of 8 100x100
	 * images could be combined into a 400x200 sprite sheet (4 frames across by 2 high). You can display individual frames,
	 * play frames as an animation, and even sequence animations together.
	 *
	 * @param {Object} config
	 * @param {SpriteSheet} config.spriteSheet a SpriteSheet instance
	 */
	var Sprite = function(config) {
		Gear.Shape.call(this, config);

		this.spritesheet = this.spritesheet || config.spritesheet;
		this.framerate = new Gear.Framerate(this.getFPS());

		/**
		 * Prevents animations from progressing
		 * @type {Boolean}
		 */
		this._isPaused = true;
		
		/**
		 * Current animation from SpriteSheet
		 * @type {Object}
		 */
		this._animation = null;

		/**
		 * Current index in the animation
		 * @type {Number}
		 */
		this._index = 0;

		/**
		 * Event passed on animationend to track
		 * if the playhead should stop as a result
		 * of the event
		 * @type {Object}
		 */
		this._e = {
			_isCancelled: false,
			stop: function() {
				this._isCancelled = true;
			}
		};

		if (this.initial || config.initial) {
			this._isPaused = false;
			this.gotoAndStop(this.initial || config.initial);
		}

		this.setSize(this.spritesheet.getSize());

		if (this.initialize) { this.initialize(); }
	};

	Sprite.extend = Gear.Util.extend;

	_.extend(Sprite.prototype, Gear.Shape.prototype, {

		draw: function(canvas) {
			var animation = this._animation;
			if (!animation) { return; }

			var frame = animation.frames[this._index];
			if (!frame) { return; }

			canvas.getContext().drawImage(frame.image, frame.x, frame.y, frame.width, frame.height, -frame.regX, -frame.regY, frame.width, frame.height);
		},

		hit: function(canvas) {
			var animation = this._animation;
			if (!animation) { return; }

			var frame = animation.frames[this._index];
			if (!frame) { return; }

			var context = canvas.getContext();

			context.beginPath();
			context.rect(0, 0, frame.width, frame.height);
			context.closePath();
			canvas.fillAndStroke(this);
		},

		/**
		 * Unpauses
		 */
		play: function() {
			this._isPaused = false;
			this.framerate.on('tick', this._tick.bind(this));
		},
		
		/**
		 * Pauses
		 */
		stop: function() {
			this._isPaused = true;
			this.framerate.off('tick');
		},

		/**
		 * Unpauses and plays the specified animation name, named frame, or frame number.
		 * @param {String} animation name
		 * @param {Number} idx optional
		 */
		gotoAndPlay: function(animation, idx) {
			this._goto(animation, idx);
			this.play();
		},

		/**
		 * Sets paused to true and seeks to the specified animation name, named frame, or frame number.
		 * @param {String} animation name
		 * @param {Number} idx optional
		 */
		gotoAndStop: function(animation, idx) {
			this._goto(animation, idx);
			this.stop();
		},

		/**
		 * Advances the playhead when we're not paused.
		 * Note that this is not a draw function. We're
		 * just listening for a time to advance
		 */
		_tick: function() {
			if (this._isPaused || !this._animation) { return; }
			this._index++;
			this._normalizeFrame();
		},

		/**
		 * Triggers when an animation ends. Returns true if a handler
		 * stopped the animation by calling e.stop();
		 * 
		 * @param  {String} next next animation's name
		 * @return {Boolean}
		 */
		_endAnimation: function(next) {
			var e = this._e;
			e._isCancelled = false;
			e.name = this._animation ? this._animation.name : null;
			e.frame = this._index || 0;
			e.isPaused = this._isPaused;
			e.next = next;

			this.trigger('animationend', e);

			return (e._isCancelled === true);
		},

		/**
		 * Normalizes the current frame, checking for stop
		 * or loop conditions
		 */
		_normalizeFrame: function() { 
			var animation = this._animation,
				length = animation.frames.length;
			
			// Our frame is valid, we can stop
			if (this._index < length) { return; }

			var next = animation.next;
			
			if (this._endAnimation(next)) {
				// Animation has been stopped
				this.stop();
				return;
			}

			if (next) {
				// loop
				this._goto(next);
				return;
			}

			// End of the line
			this.stop();
			this._index = (animation.frames.length - 1);
		},
		
		/**
		 * Moved the playhead to the specified animation and index
		 * @param  {String} animation
		 * @param  {Number} idx optional
		 */
		_goto: function(animation, idx) {
			animation = animation || '';
			idx = idx || 0;

			var spriteAnimation = this.spritesheet.getAnimation(animation);
			if (!spriteAnimation) { return; }

			this._index = idx;
			this._animation = spriteAnimation;
		},

		/**
		 * Get and set the framerate.
		 * This sprite's framerate will be used if
		 * available, otherwise, default to the spriteSheet's framerate
		 * and last ditch effor, reference the FPS set in Gear.Tick
		 * 
		 * @return {Number} FPS
		 */
		getFPS: function() {
			return this.attr.framerate || (this.spriteSheet) ? this.spriteSheet.framerate : Gear.Tick.getFPS();
		},

		setFPS: function(fps) {
			this.attr.framerate = fps;
			this.framerate.setFPS(fps);
			return this;
		},

		// TODO: Clone

		toString: function() {
			return '[Sprite]';
		}
	});

	Gear.Sprite = Sprite;

}(Gear));
