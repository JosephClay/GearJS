// TODO: Text unit tests
test('Text', function() {

	var stage = new Gear.Stage({
			container: 'Test9',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		text = new Gear.Text({
			x: 0,
			y: 0,
			text: 'Lorem Ipsum',
			fontSize: 14,
			fontFamily: 'Calibri',
			fill: 'black'
		});

	stage.add(layer);
	layer.add(text);

	ok(text instanceof Gear.Text, 'text created');
});