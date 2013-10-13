test('Shape', function() {


	var stage = new Gear.Stage({
			container: 'Test0',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		shape = new Gear.Shape();

	stage.add(layer);
	// layer.auto();
	
	ok(shape instanceof Gear.Shape, 'shape created');
	ok(_.isString(shape.getColorId()) && _.isNumber(shape.getColorId() * 1), 'color id generated');
	ok(Gear.Global.shapes[shape.getColorId()] !== undefined, 'color id is in global shapes');
});