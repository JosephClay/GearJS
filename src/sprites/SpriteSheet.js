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
						reverse: animationDefinition.reverse,
						regX: _.isNumber(animationDefinition.x) ? (animationDefinition.x + this._regX) : this._regX,
						regY: _.isNumber(animationDefinition.y) ? (animationDefinition.y + this._regY) : this._regY,
						width: _.isNumber(animationDefinition.width) ? animationDefinition.width : this._frameWidth,
						height: _.isNumber(animationDefinition.height) ? animationDefinition.height : this._frameHeight
					};

					anim.frames = this._calculateFrames(anim, animationDefinition.frames || []);
					if (anim.reverse) { anim.frames.reverse(); }

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
				frame.width = _.isNumber(frame.width) ? frame.width : _.isNumber(animation.width) ? animation.width : this._frameWidth;
				frame.height = _.isNumber(frame.height) ? frame.height : _.isNumber(animation.height) ? animation.height : this._frameHeight;
				frame.x = _.isNumber(frame.x) ? (frame.x + (idx * col)) : (idx * col);
				frame.y = _.isNumber(frame.y) ? (frame.y + (idx * row)) : (idx * row);
				frame.regX = _.isNumber(frame.regX) ? frame.regX : animation.regX;
				frame.regY = _.isNumber(frame.regY) ? frame.regY : animation.regY;
				
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
					image: frame.image,
					width: frame.width,
					height: frame.height,
					x: (idx * col),
					y: (idx * row),
					regX: frame.regX,
					regY: frame.regY
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