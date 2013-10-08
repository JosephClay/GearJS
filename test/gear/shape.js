test('Shape', function() {
	var shape = new Gear.Shape();

	ok(shape instanceof Gear.Shape, 'shape created');
	ok(_.isString(shape.getColorId()) && _.isNumber(shape.getColorId() * 1), 'color id generated');
	ok(Gear.Global.shapes[shape.getColorId()] !== undefined, 'color id is in global shapes');

	var stage = new Gear.Stage({
			container: 'Test2',
			width: 500,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 500,
			height: 100
		}),
		group = new Gear.Group({
			width: 500,
			height: 100
		}),
		rect = new Gear.Rect({
			x: 0,
			y: 0,
			width: 250,
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
		}),
		circle = new Gear.Circle({
			x: stage.getWidth() / 2,
			y: 25,
			radius: 20,
			fill: 'red',
			stroke: 'black',
			strokeWidth: 4
		}),
		wedge = new Gear.Wedge({
			x: 120,
			y: 5,
			radius: 20,
			angle: 90,
			rotate: 0,
			fill: 'brown'
		}),
		redLine = new Gear.Line({
			points: [
				{ x: 73, y: 70 },
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
				{ x: 73, y: 70 },
				{ x: 340, y: 23 }, 
				{ x: 450, y: 60 },
				{ x: 500, y: 20 }
			],
			stroke: 'green',
			strokeWidth: 2,
			lineJoin: 'round',
			// line segments with a length of 33px with a gap of 10px
			dashArray: [33, 10]
		}),
		// complex dashed and dotted line
		blueLine = new Gear.Line({
			points: [
				{ x: 73, y: 70 },
				{ x: 340, y: 23 }, 
				{ x: 450, y: 60 },
				{ x: 500, y: 20 }
			],
			stroke: 'blue',
			strokeWidth: 10,
			lineCap: 'round',
			lineJoin: 'round',
			dashArray: [29, 20, 0.001, 20]
		}),
		ellipse = new Gear.Ellipse({
			x: 40,
			y: 50,
			radius: { x: 20, y: 10 },
			fill: 'blue'
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
		}),
		spline = new Gear.Spline({
			scale: { x: 0.5, y: 0.5 },
			x: 100,
			y: 50,
			points: [
				{ x: 73, y: 70 },
				{ x: 340, y: 23 },
				{ x: 450, y: 60 },
				{ x: 500, y: 20 }
			],
			stroke: 'green',
			tension: 1
		}),
		text = new Gear.Text({
			x: 0,
			y: 0,
			text: 'Lorem Ipsum',
			fontSize: 14,
			fontFamily: 'Calibri',
			fill: 'black'
		}),
		blob = new Gear.Blob({
			x: 250,
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
	layer.add(group);
	layer.auto();

	group.add(rect);
	layer.add(roundedRect);
	group.add(circle);
	group.add(wedge);
	
	layer.add(blob);

	layer.add(redLine);
	layer.add(greenLine.move({ y: -15 }));
	layer.add(blueLine.move({ y: 15 }));
	
	layer.add(ellipse);
	layer.add(polygon);
	layer.add(spline);
	layer.add(text);

	stage.setListening(true);
	layer.setListening(true);
	group.setListening(true);
	rect.setListening(true);

	rect.on('mousedown', function() {
		console.log('mousedown');
	});
	rect.on('click', function() {
		console.log('click');
	});
	rect.on('mouseover', function() {
		console.log('over');
	});
	rect.on('mouseout', function() {
		console.log('out');
	});
	rect.on('mousemove', function() {
		console.log('move');
	});

	var img = new Image();
	img.onload = function() {
		var image = new Gear.Image({
			x: 75,
			y: 75,
			image: this
		});
		layer.add(image);
	};
	img.src = 'http://placehold.it/50x50';
});