// TODO: Line unit tests
test('Line', function() {

	var stage = new Gear.Stage({
			container: 'Test3',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		redLine = new Gear.Line({

			points: [
				{ x: 20, y: 20 },
				{ x: 340, y: 23 },
				{ x: 450, y: 60 },
				{ x: 500, y: 20 }
			],
			stroke: 'red',
			strokeWidth: 3,
			lineCap: 'round',
			lineJoin: 'round'
		}),
		// dashed line
		greenLine = new Gear.Line({
			points: [
				{ x: 20, y: 20 },
				{ x: 340, y: 23 }, 
				{ x: 450, y: 60 },
				{ x: 500, y: 20 }
			],
			stroke: {
				style: 'green',
				width: 2,
				lineJoin: 'round',
				// line segments with a length of 33px with a gap of 10px
				dashArray: [33, 10]
			}
		}),
		// complex dashed and dotted line
		blueLine = new Gear.Line({
			points: [
				{ x: 20, y: 20 },
				{ x: 340, y: 23 }, 
				{ x: 450, y: 60 },
				{ x: 500, y: 20 }
			],
			stroke: {
				style: 'blue',
				width: 10,
				lineCap: 'round',
				lineJoin: 'round',
				dashArray: [29, 20, 0.001, 20]
			}
		});

	stage.add(layer);
	layer.add(redLine);
	layer.add(greenLine.move({ y: -15 }));
	layer.add(blueLine.move({ y: 15 }));

	ok(redLine instanceof Gear.Line, 'red line created');
});