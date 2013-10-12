(function(Gear) {

	/**
	 * Encapsulates the properties and methods associated with a spritesheet.
	 * A sprite sheet is a series of image (usually animation frames) combined
	 * into a larger image (or image).
	 *
	 * @param {Object} config An object describing the SpriteSheet data.
	 */
	var SpriteSheet = function(config) {
		Gear.Signal.call(this);

		this.framerate = config.framerate || 0;
		this._image = config.image;
 
		var frame = config.frame;
		this._frameWidth = frame.width || 0;
		this._frameHeight = frame.height || 0;
		this._regX = frame.regX || 0;
		this._regY = frame.regY || 0;
		this._animations = {};
		this._isVertial = frame.vertical;

		this._calculateAnimations(config);
	};

	_.extend(SpriteSheet.prototype, Gear.Signal.prototype, {

		getAnimation: function(animation) {
			return this._animations[animation];
		},

		_calculateAnimations: function(data) {
			if (!data.animations) { return; }
			
			var animationName;
			for (animationName in data.animations) {
				var animationDefinition = data.animations[animationName];
					anim = {
						name: animationName,
						next: animationDefinition.next,
						x: _.exists(animationDefinition.x) ? (animationDefinition.x + this._regX) : this._regX,
						y: _.exists(animationDefinition.y) ? (animationDefinition.y + this._regY) : this._regY,
						width: _.exists(animationDefinition.width) ? animationDefinition.width : this._frameWidth,
						height: _.exists(animationDefinition.height) ? animationDefinition.height : this._frameHeight
					};

					anim.frames = this._calculateFrames(anim, animationDefinition.frames || []);

				this._animations[animationName] = anim;
			}
		},

		_calculateFrames: function(animation, frames) {
			var arr = [],
				idx = 0, length = frames.length,
				col = !this._isVertial ? animation.width : 0,
				row = this._isVertial ? animation.height : 0,
				currentIdx = 0,
				frame;
			for (; idx < length; idx++) {
				frame = frames[idx];

				frame.image = this._image;
				frame.width = _.exists(frame.width) ? frame.width : _.exists(animation.width) ? animation.width : this._frameWidth;
				frame.height = _.exists(frame.height) ? frame.height : _.exists(animation.height) ? animation.height : this._frameHeight;
				frame.x = _.exists(frame.x) ? ((frame.x + animation.x) + (idx * col)) : (animation.x + (idx * col));
				frame.y = _.exists(frame.y) ? ((frame.y + animation.y) + (idx * row)) : (animation.y + (idx * row));
				
				if (idx < frame.idx) {
					this._addDeltaFrames(animation, idx, frame.idx, frame, arr);
				}
				arr.push(frame);
			}

			return arr;
		},

		_addDeltaFrames: function(animation, idx, endingIdx, frame, arr) {
			var col = !this._isVertial ? animation.width : 0,
				row = this._isVertial ? animation.height : 0;
			for (; idx < endingIdx; idx++) {
				arr.push({
					idx: idx,
					width: frame.width,
					height: frame.height,
					x: (animation.x + (idx * col)),
					y: (animation.y + (idx * row))
				});
			}
			return arr;
		},

		toString: function() {
			return '[SpriteSheet]';
		}
	 });

	Gear.SpriteSheet = SpriteSheet;

}(Gear));