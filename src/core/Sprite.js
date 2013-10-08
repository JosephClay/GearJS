(function(Gear) {

	/**
	 * Encapsulates the properties and methods associated with a sprite sheet. A sprite sheet is a series of images (usually
	 * animation frames) combined into a larger image (or images). For example, an animation consisting of eight 100x100
	 * images could be combined into a single 400x200 sprite sheet (4 frames across by 2 high).
	 *
	 * The data passed to the Sprite constructor defines three critical pieces of information:
	 *    > The image or images to use.
	 *    > The positions of individual image frames. This data can be represented in one of two ways: As a regular grid of sequential, equal-sized frames, or as individually defined, variable sized frames arranged in an irregular (non-sequential) fashion.
	 *    > Likewise, animations can be represented in two ways: As a series of sequential frames, defined by a start and end frame [0,3], or as a list of frames [0,1,2,3].
	 *
	 *      data = {
	 *
	 *          // DEFINING IMAGES:
	 *          // list of images or image URIs to use. Sprite can handle preloading.
	 *          // the order dictates their index value for frame definition.
	 *          images: [image1, 'path/to/image2.png'],
	 *
	 *          // DEFINING FRAMES:
	 * 	        // the simple way to define frames, only requires frame size because frames are consecutive:
	 * 	        // define frame width/height, and optionally the frame count and registration point x/y.
	 * 	        // if count is omitted, it will be calculated automatically based on image dimensions.
	 * 	        frames: {width:64, height:64, count:20, regX: 32, regY:64},
	 *
	 * 	        // OR, the complex way that defines individual rects for frames.
	 * 	        // The 5th value is the image index per the list defined in 'images' (defaults to 0).
	 * 	        frames: [
	 * 	        	// x, y, width, height, imageIndex, regX, regY
	 * 	        	[0,0,64,64,0,32,64],
	 * 	        	[64,0,96,64,0]
	 * 	        ],
	 *
	 *          // DEFINING ANIMATIONS:
	 *
	 * 	        // simple animation definitions. Define a consecutive range of frames.
	 * 	        // also optionally define a 'next' animation name for sequencing.
	 * 	        // setting next to false makes it pause when it reaches the end.
	 * 	        animations: {
	 * 	        	// start, end, next, frequency
	 * 	        	run: [0,8],
	 * 	        	jump: [9,12,'run',2],
	 * 	        	stand: 13
	 * 	        }
	 *
	 *          // the complex approach which specifies every frame in the animation by index.
	 *          animations: {
	 *          	run: {
	 *          		frames: [1,2,3,3,2,1]
	 *          	},
	 *          	jump: {
	 *          		frames: [1,4,5,6,1],
	 *          		next: 'run',
	 *          		frequency: 2
	 *          	},
	 *          	stand: { frames: [7] }
	 *          }
	 *
	 * 	        // the above two approaches can be combined, you can also use a single frame definition:
	 * 	        animations: {
	 * 	        	run: [0,8,true,2],
	 * 	        	jump: {
	 * 	        		frames: [8,9,10,9,8],
	 * 	        		next: 'run',
	 * 	        		frequency: 2
	 * 	        	},
	 * 	        	stand: 7
	 * 	        }
	 *      }
	 *
	 * To define a simple sprite sheet, with a single image 'sprites.jpg' arranged in a regular 50x50 grid with two
	 * animations, 'run' looping from frame 0-4 inclusive, and 'jump' playing from frame 5-8 and sequencing back to run:
	 *
	 *      var data = {
	 *          images: ['sprites.jpg'],
	 *          frames: {width:50, height:50},
	 *          animations: {run:[0,4], jump:[5,8,'run']}
	 *      };
	 *      var animation = new Gear.BitmapAnimation(data);
	 *      animation.gotoAndPlay('run');
	 */
	var Sprite = function(data) {
		data = data || {};

		// image:
		this._image = data.image;
		
		// parse bounds:
		var obj = data.bounds || {};
		this._frameWidth = obj.width || 0;
		this._frameHeight = obj.height || 0;
		this._regX = obj.regX || 0;
		this._regY = obj.regY || 0;
		this._numFrames = obj.count;
		
		// parse animations:
		var animations = data.animations;
		this._animations = [];
		this._data = {};
		if (!_.exists(animations)) { return; }
		
		var name;
		for (name in animations) {
			var anim = { name: name },
				animation = animations[name];

			if (animation.length === 1) {
				anim.frames = [animation[0]];
			} else {
				anim.frequency = animation[3];
				anim.next = animation[2];
				anim.frames = [];

				var idx = animation[0], length = animation[1];
				for (; idx <= length; idx++) {
					anim.frames.push(idx);
				}
			}

			anim.next = (anim.frames.length < 2 || anim.next === false) ? null : (!_.exists(anim.next) || anim.next === true) ? name : anim.next;
			if (!anim.frequency) { anim.frequency = 1; }
			this._animations.push(name);
			this._data[name] = anim;
		}
	};

	Sprite.prototype = {
		/**
		 * Returns the total number of frames in the specified animation, or in the whole sprite
		 * sheet if the animation param is omitted.
		 * 
		 * @param {String} animation The name of the animation to get a frame count for.
		 * @return {Number} The number of frames in the animation, or in the entire sprite sheet if the animation param is omitted.
		*/
		getNumFrames: function(animation) {
			if (!_.exists(animation)) {
				return this._numFrames;
			}

			var data = this._data[animation];
			return (!_.exists(data)) ? 0 : data.frames.length;
		},
		
		getAnimations: function() {
			return _.slice(this._animations);
		},
		
		/**
		 * Returns an object defining the specified animation. The returned object has a
		 * frames property containing an array of the frame id's in the animation, a frequency
		 * property indicating the advance frequency for this animation, a name property, 
		 * and a next property, which specifies the default next animation. If the animation
		 * loops, the name and next property will be the same.
		 * 
		 * @param {String} name The name of the animation to get.
		 * @return {Object} a generic object with frames, frequency, name, and next properties.
		 */
		getAnimation: function(name) {
			return this._data[name];
		},

		clone: function() {
			throw new Error('No reason to clone, instances can be reused');
		},

		toString: function() {
			return '[Sprite]';
		}
	};

	Gear.Sprite = Sprite;

}(Gear));
