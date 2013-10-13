// TODO: Image unit tests
test('Image', function() {

	var img = new Image();
	img.src = 'http://placehold.it/50x50';

	var stage = new Gear.Stage({
			container: 'Test10',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		image = new Gear.Image({
			image: img,
			x: 15,
			y: 15
		});

	stage.add(layer);
	layer.add(image);

	ok(image instanceof Gear.Image, 'image created');
});