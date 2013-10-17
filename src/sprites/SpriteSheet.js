// TODO: Optimize
(function(Gear, Util) {

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

	Util.construct(SpriteSheet.prototype, Gear.Signal.prototype, {

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
			// Frame creation
			var arr = [],
				idx = 0, length = frames.length,
				col = !this._isVertial ? animation.width : 0,
				row = this._isVertial ? animation.height : 0,
				currentIdx = 0,
				frame;
			for (; idx < length; idx += 1) {
				frame = frames[idx];

				if (_.isNumber(frame)) {
					frame = this._generateFrame({ idx: frame });
				}

				frame.image = this._image;
				frame.width = _.isNumber(frame.width) ? frame.width : _.isNumber(animation.width) ? animation.width : this._frameWidth;
				frame.height = _.isNumber(frame.height) ? frame.height : _.isNumber(animation.height) ? animation.height : this._frameHeight;
				frame.x = _.isNumber(frame.x) ? (frame.x + (frame.idx * col)) : (frame.idx * col);
				frame.y = _.isNumber(frame.y) ? (frame.y + (frame.idx * row)) : (frame.idx * row);
				frame.regX = _.isNumber(frame.regX) ? frame.regX : animation.regX;
				frame.regY = _.isNumber(frame.regY) ? frame.regY : animation.regY;
				
				arr.push(frame);
			}

			// Delta Frames
			idx = 0;
			var startFrame, nextFrame;
			for (; idx < length; idx += 2) {
				startFrame = arr[idx];
				nextFrame = arr[idx + 1];
				if (!startFrame || !nextFrame) { continue; }

				if (startFrame.idx + 1 !== nextFrame.idx) {
					this._addDeltaFrames(animation, startFrame, nextFrame, arr);
				}
			}

			return arr;
		},

		_addDeltaFrames: function(animation, startFrame, endFrame, arr) {
			var col = !this._isVertial ? animation.width : 0,
				row = this._isVertial ? animation.height : 0,
				idx = startFrame.idx + 1, endingIdx = endFrame.idx,
				newFrame;
			for (; idx < endingIdx; idx += 1) {
				arr.push(
					this._generateFrame({
						idx: idx,
						image: startFrame.image,
						width: startFrame.width,
						height: startFrame.height,
						x: (idx * col),
						y: (idx * row),
						regX: startFrame.regX,
						regY: startFrame.regY
					})
				);
			}
			return arr;
		},

		_generateFrame: function(config) {
			var template = {
					idx: null,
					image: null,
					width: null,
					height: null,
					x: null,
					y: null,
					regX: null,
					regY: null
				};
			return _.extend(template, config);
		},

		getSize: function() {
			return {
				width: this.getWidth(),
				height: this.getHeight()
			};
		},
		getWidth: function() {
			return this._frameWidth;
		},
		getHeight: function() {
			return this._frameHeight;
		},

		toString: function() {
			return '[SpriteSheet]';
		}
	 });

	Gear.SpriteSheet = SpriteSheet;

}(Gear, Gear.Util));