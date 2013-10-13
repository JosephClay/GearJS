test('Spline', function() {
	
	var stage = new Gear.Stage({
			container: 'Test7',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		spline = new Gear.Spline({
			x: 5,
			y: 5,
			tension: 1,
			scale: { x: 0.5, y: 0.5 },
			points: [
				{ x: 73, y: 70 },
				{ x: 340, y: 23 },
				{ x: 450, y: 60 },
				{ x: 500, y: 20 }
			],
			stroke: {
				style: 'green'
			}
		});

	stage.add(layer);
	layer.add(spline);
});