test('Canvas', function() {
	var canvas = new Gear.Canvas({
		width: 50,
		height: 50
	});

	ok(canvas instanceof Gear.Canvas, 'Canvas created');
	
	ok(_.isElement(canvas.getElem()) && canvas.getElem().tagName === 'CANVAS', 'canvas element created');
	ok(canvas.getElem().style.width === '50px', 'canvas width set');
	ok(canvas.getElem().style.height === '50px', 'canvas height set');
	
	ok(canvas.getContext(), 'context exists');

	ok(canvas.getPixelRatio() === 1, 'pixel ratio is 1');
	canvas.setPixelRatio(2);
	ok(canvas.getPixelRatio() === 2, 'pixel ratio can be set');
	canvas.setPixelRatio(1);
});