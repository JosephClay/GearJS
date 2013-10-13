// TODO: Circle unit tests
test('Circle', function() {

	var stage = new Gear.Stage({
			container: 'Test2',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		circle = new Gear.Circle({
			x: stage.getWidth() / 2,
			y: 25,
			radius: 20,
			fill: 'red',
			stroke: {
				width: 4,
				style: 'black'
			}
		});

	stage.add(layer);
	layer.add(circle);

	ok(circle instanceof Gear.Circle, 'circle created');
});