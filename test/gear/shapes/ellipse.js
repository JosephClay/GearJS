test('Ellipse', function() {

	var stage = new Gear.Stage({
			container: 'Test5',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		ellipse = new Gear.Ellipse({
			x: 40,
			y: 50,
			radius: { x: 20, y: 10 },
			fill: 'blue'
		});

	stage.add(layer);
	layer.add(ellipse);
});