(function(Gear, Util) {
		
	/**
	 * Displays frames or sequences of frames (ie. animations) from a sprite sheet image. A sprite sheet is a series of
	 * images (usually animation frames) combined into a single image. For example, an animation consisting of 8 100x100
	 * images could be combined into a 400x200 sprite sheet (4 frames across by 2 high). You can display individual frames,
	 * play frames as an animation, and even sequence animations together.
	 *
	 * See the SpriteSheet class for more information on setting up frames and animations.
	 *
	 *      var instance = new Gear.BitmapAnimation(spriteSheet);
	 *      instance.gotoAndStop('frameName');
	 *
	 * Currently, you must call either BitmapAnimation/gotoAndStop or
	 * BitmapAnimation/gotoAndPlay, or nothing will display on stage.
	 *
	 * @param {SpriteSheet} spriteSheet The SpriteSheet instance to play back. This includes the source image(s), frame dimensions, and frame data. See SpriteSheet for more information.
	 */
	var BitmapAnimation = function(config) {
		Gear.Node.call(this);

		this.spriteSheet = this.sprite || config;

		// The frame that will be drawn when draw is called. Note that with some SpriteSheet data, this
		// will advance non-sequentially. READ-ONLY.
		this.currentFrame = -1;

		// Currently playing animation
		// @type {String}
		this.currentAnimation = null;

		// Prevents the animation from advancing each tick automatically. For example, you could create a sprite
		// sheet of icons, set paused to true, and display the appropriate icon by setting currentFrame.
		this.isPaused = true;
		
		// When used in conjunction with animations having an frequency greater than 1, this lets you offset which tick the
		// playhead will advance on. For example, you could create two BitmapAnimations, both playing an animation with a
		// frequency of 2, but one having offset set to 1. Both instances would advance every second tick, but they would
		// advance on alternating ticks (effectively, one instance would advance on odd ticks, the other on even ticks).
		this.offset = 0;
		
		// Specifies the current frame index within the current playing animation. When playing normally, this will increase
		// successively from 0 to n-1, where n is the number of frames in the current animation.
		this.currentAnimationFrame = 0;

		this._advanceCount = 0;
		
		// @type {Object}
		this._animation = null;

		if (this.initialize) { this.initialize(config); }
	};

	_.extend(BitmapAnimation.prototype, Gear.Node.prototype, {

		/**
		 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
		 * Returns true if the draw was handled (useful for overriding functionality).
		 * 
		 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
		 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache. For example, used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
		 */
		draw: function(ctx, ignoreCache) {
			// if (this.draw.call(this, ctx, ignoreCache)) { return true; }

			this._normalizeFrame();
			
			var frame = this.spriteSheet.getFrame(this.currentFrame);
			if (!frame) { return; }

			var rect = frame.rect;
			ctx.drawImage(frame.image, rect.x, rect.y, rect.width, rect.height, -frame.regX, -frame.regY, rect.width, rect.height);

			return true;
		},

		/**
		 * Begin playing a paused animation. The BitmapAnimation will be paused if either BitmapAnimation/stop
		 * or BitmapAnimation/gotoAndStop is called. Single frame animations will remain unchanged.
		 */
		play: function() { this.isPaused = false; },
		
		/**
		 * Stop playing a running animation. The BitmapAnimation will be playing if BitmapAnimation/gotoAndPlay
		 * is called. Note that calling BitmapAnimation/gotoAndPlay or BitmapAnimation/play will resume playback.
		 */
		stop: function() { this.isPaused = true; },

		/**
		 * Sets paused to false and plays the specified animation name, named frame, or frame number.
		 * @param {String|Number} frameOrAnimation The frame number or animation name that the playhead should move to and begin playing.
		 */
		gotoAndPlay: function(frameOrAnimation) {
			this.isPaused = false;
			this._goto(frameOrAnimation);
		},

		/**
		 * Sets paused to true and seeks to the specified animation name, named frame, or frame number.
		 * @param {String|Number} frameOrAnimation The frame number or animation name that the playhead should move to and stop.
		 */
		gotoAndStop: function(frameOrAnimation) {
			this.isPaused = true;
			this._goto(frameOrAnimation);
		},

		// Advances the playhead. This occurs automatically each tick by default.
		advance: function() {
			if (this._animation) {
				this.currentAnimationFrame++;
			} else {
				this.currentFrame++;
			}
			this._normalizeFrame();
		},
		
		/**
		 * Returns a Rectangle instance defining the bounds of the current frame relative to
		 * the origin. For example, a 90 x 70 frame with regX=50 and regY=40 would return a
		 * rectangle with [x=-50, y=-40, width=90, height=70].
		 *
		 * Also see the SpriteSheet SpriteSheet/getFrameBounds method.
		 * 
		 * @return {Rectangle} A Rectangle instance. Returns null if the frame does not exist, or the image is not fully loaded.
		 */
		getBounds: function() {
			return this.spriteSheet.getFrameBounds(this.currentFrame);
		},

		// Advances the currentFrame if paused is not true. This is called automatically when the Stage ticks.
		_tick: function(params) {
			var f = this._animation ? this._animation.frequency : 1;

			if (!this.isPaused && ((++this._advanceCount) + this.offset) % f === 0) {
				this.advance();
			}
		},
		
		// Normalizes the current frame, advancing animations and dispatching callbacks as appropriate.
		_normalizeFrame: function() { 
			var animation = this._animation,
				frame = this.currentFrame,
				isPaused = this.isPaused,
				length;
			
			if (animation) {
				length = animation.frames.length;

				if (this.currentAnimationFrame >= length) {
					var next = animation.next;
					if (this.dispatchAnimationEnd(animation, frame, isPaused, next, (length - 1))) {
						// do nothing, something changed in the event stack.
						length = length;
					} else if (next) {
						this._goto(next);
					} else {
						this.isPaused = true;
						this.currentAnimationFrame = (animation.frames.length - 1);
						this.currentFrame = animation.frames[this.currentAnimationFrame];
					}
				} else {
					this.currentFrame = animation.frames[this.currentAnimationFrame];
				}
			} else {
				length = this.spriteSheet.getNumFrames();

				if (frame >= length) {
					if (!this.dispatchAnimationEnd(animation, frame, isPaused, (length - 1))) { this.currentFrame = 0; }
				}
			}
		},
		
		/**
		 * Dispatches the 'animationend' event. Returns true if a handler changed the animation (ex. calling BitmapAnimation/stop,
		 * BitmapAnimation/gotoAndPlay, etc.)
		 */
		dispatchAnimationEnd: function(animation, frame, isPaused, next, end) {
			var name = (animation) ? animation.name : null;

			this.dispatch('animationend', {
				name: name,
				next: next
			});

			if (!isPaused && this.isPaused) { this.currentAnimationFrame = end; }

			return (this.isPaused !== isPaused || this._animation !== animation || this.currentFrame !== frame);
		},

		cloneProps: function(text) {
			this.DisplayObject.cloneProps.call(this, text);
			text.currentFrame = this.currentFrame;
			text.currentAnimation = this.currentAnimation;
			textisPaused = this.isPaused;
			text.offset = this.offset;
			text._animation = this._animation;
			text.currentAnimationFrame = this.currentAnimationFrame;
		},

		// Moves the playhead to the specified frame number or animation.
		// @param {String|Number} frameOrAnimation The frame number or animation that the playhead should move to.
		_goto: function(frameOrAnimation) {
			if (_.isString(frameOrAnimation)) {
				var data = this.spriteSheet.getAnimation(frameOrAnimation);
				if (!data) { return; }

				this.currentAnimationFrame = 0;
				this._animation = data;
				this.currentAnimation = frameOrAnimation;
				this._normalizeFrame();

				return;
			}

			this.currentAnimation = this._animation = null;
			this.currentFrame = frameOrAnimation;
		},

		isVisible: function() {
			return !!(this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0 && (
				// hasContent
				this.cacheCanvas || this.currentFrame >= 0
			));
		},

		clone: function() {
			var clone = new BitmapAnimation(this.spriteSheet);
			this.cloneProps(clone);
			return clone;
		},

		toString: function() {
			return '[BitmapAnimation (name='+ this.name +')]';
		}
	});

	Gear.BitmapAnimation = BitmapAnimation;

}(Gear, Gear.Util));
