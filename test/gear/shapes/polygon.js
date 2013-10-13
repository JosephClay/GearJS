test('Polygon', function() {
	
	var stage = new Gear.Stage({
			container: 'Test6',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		polygon = new Gear.Polygon({
			scale: { x: 0.2, y: 0.2 },
			points: [
				{ x: 73, y: 192 },
				{ x: 73, y: 160 },
				{ x: 340, y: 23 },
				{ x: 500, y: 109 },
				{ x: 499, y: 139 },
				{ x: 342, y: 93 }
			],
			fill: 'orange'
		});

	stage.add(layer);
	layer.add(polygon);
});