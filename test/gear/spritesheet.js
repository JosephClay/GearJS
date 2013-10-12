test('SpriteSheet', function() {

	var img = new Image();
	img.src = 'test/assets/jars-sprite.jpg';

	var spritesheet = new Gear.SpriteSheet({
		framerate: 20,
		image: img,
		frame: {
			width: 30,
			height: 42,
			regX: 0,
			regY: 0
		},
		animations: {
			jump: {
				frames: [
					{ idx: 0 },
					{ idx: 7 }
				]
			}
		}
	});

	console.log('spritesheet: ', spritesheet);

	ok(spritesheet instanceof Gear.SpriteSheet, 'spritesheet is a SpriteSheet');
	// ok(spritesheet._animations.length, 'spritesheet has animations');
	// ok(_.isObject(spritesheet._data) && _.size(spritesheet._data), 'spritesheet has populated data');
	// ok(spritesheet.framerate === 20, 'spritesheet has framerate set');
	// ok(spritesheet._numFrames === 7, 'spritesheet has set count');
	// ok(spritesheet._image instanceof Image, 'spritesheet has an image');
	
	// ok(spritesheet2._numFrames === 12, 'spritesheet can determine count correctly');
});