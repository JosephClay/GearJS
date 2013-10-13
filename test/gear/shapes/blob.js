// TODO: Blob unit tests
test('Blob', function() {

	var stage = new Gear.Stage({
			container: 'Test8',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		blob = new Gear.Blob({
			scale: { x: 0.5, y: 0.5 },
			points: [
				{ x: 73, y: 140 },
				{ x: 340, y: 23 },
				{ x: 500, y: 109 },
				{ x: 300, y: 170 }
			],
			tension: 0.8,
			fill: 'yellow'
		});

	stage.add(layer);
	layer.add(blob);

	ok(blob instanceof Gear.Blob, 'blob created');
});