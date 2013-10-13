//asyncTest(function() {
(function() {
	var stage = new Gear.Stage({
			container: 'Test11',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		});

	stage.add(layer);
	layer.auto();

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
			play: {
				frames: [
					{ idx: 0 },
					{ idx: 6 }
				],
				next: 'play'
			}
		}
	});

	var sprite = new Gear.Sprite({
		initial: 'play',
		spritesheet: spritesheet
	});
	
	layer.add(sprite);

	sprite.gotoAndPlay('play');
}());
//});