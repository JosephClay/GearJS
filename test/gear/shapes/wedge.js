// TODO: Wedge unit tests
test('Wedge', function() {
	
	var stage = new Gear.Stage({
			container: 'Test4',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		wedge = new Gear.Wedge({
			x: 20,
			y: 20,
			radius: 20,
			angle: 90,
			rotate: 0,
			fill: 'brown'
		});

	stage.add(layer);
	layer.add(wedge);

	ok(wedge instanceof Gear.Wedge, 'wedge created');
});