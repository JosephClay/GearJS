test('Image', function() {

	var stage = new Gear.Stage({
			container: 'Test10',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		});

	stage.add(layer);

	var img = new Image();
	img.onload = function() {
		var image = new Gear.Image({
			x: 15,
			y: 15,
			image: this
		});
		layer.add(image);
	};
	img.src = 'http://placehold.it/50x50';

});