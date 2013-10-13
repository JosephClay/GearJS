test('Rect', function() {

	var stage = new Gear.Stage({
			container: 'Test1',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		rect = new Gear.Rect({
			x: 0,
			y: 0,
			width: 75,
			height: 25,
			fill: 'green'
		}),
		roundedRect = new Gear.Rect({
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			width: 25,
			height: 25,
			cornerRadius: 5,
			fill: 'blue',
			rotate: 45
		});

	stage.add(layer);
	layer.add(rect);
	layer.add(roundedRect);
});