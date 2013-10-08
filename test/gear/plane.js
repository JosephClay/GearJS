test('Plane', function() {
	var plane = Gear.Plane({
		x: 1,
		y: 1,
		width: 1,
		height: 1
	});

	ok(plane, 'Plane created');

	ok(plane.x === 1, 'accessing x directly works');
	ok(plane.y === 1, 'accessing y directly works');
	ok(plane.width === 1, 'accessing width directly works');
	ok(plane.height === 1, 'accessing height directly works');
	
	ok(plane.getX() === 1, 'x getter works');
	ok(plane.getY() === 1, 'y getter works');
	ok(plane.getWidth() === 1, 'width getter works');
	ok(plane.getHeight() === 1, 'height getter works');

	plane.setX(2);
	ok(plane.getX() === 2, 'setting x works');
	
	plane.setY(2);
	ok(plane.getY() === 2, 'setting y works');
	
	plane.setWidth(2);
	ok(plane.getWidth() === 2, 'setting width works');
	
	plane.setHeight(2);
	ok(plane.getHeight() === 2, 'setting height works');

	plane.set({
		x: 3,
		y: 3,
		width: 3,
		height: 3
	});
	ok(plane.x === 3 && plane.y === 3 && plane.width === 3 && plane.height === 3, 'plane can be set with object');

	plane.setX(4.5);
	plane.setY(4.5);
	ok(plane.x === 4.5 && plane.y === 4.5, 'points can be set to a float');

	plane.floor();
	ok(plane.x === 4 && plane.y === 4, 'points can be floored');

	plane.offset({ x: 1, y: 1 });
	ok(plane.x === 5 && plane.y === 5, 'points can be offset');

	plane.set({ x: 5, y: 5, width: 5, height: 5 });
	plane.inflate(5, 5);
	ok(plane.x === 0 && plane.y === 0 && plane.width === 15 && plane.height === 15, 'plane can be inflated');
	
	plane.set({ x: 6, y: 6, width: 6, height: 6 });
	deepEqual(plane.size(), { width: 6, height: 6 }, 'size can be retrieved');

	ok(plane.contains(5, 5) === false, 'contains returns false when coordinates sit outside the plane');
	ok(plane.contains(7, 7) === true, 'contains returns true when coordinates sit inside the plane');
	
	var clone = plane.clone();
	ok(plane.equals(clone), 'a cloned pane is equal to its original');

	plane.set({ x: 7, y: 7, width: 10, height: 10 });
	clone.set({ x: 8, y: 8, width: 10, height: 10 });
	ok(plane.x === 7 && clone.x === 8, 'cloned planes are separate');

	var intersection = plane.intersection(clone);
	ok(intersection.x === 8 && intersection.y === 8 && intersection.width === 17 && intersection.height === 17, 'plane return an intersection');
	
	intersection.destroy();
	ok(intersection.x === 0 && intersection.y === 0 && intersection.width === 0 && intersection.height === 0, 'a destroyed plane clears');
	
	deepEqual(intersection.toObject(), { x: 0, y: 0, width: 0, height: 0 }, 'toObject returns an object of values');

	plane.set({ x: 10, y: 10, width: 10, height: 10 });
	
	ok(plane.getHalfWidth() === 5, 'get half width works');
	ok(plane.getHalfHeight() === 5, 'get half height works');
	ok(plane.getCenterX() === 15, 'get center x works');
	ok(plane.getCenterY() === 15, 'get center y works');

	ok(plane.getVolume() === 100, 'volume calculated correctly');
	ok(plane.getPerimeter() === 40, 'perimeter calculated correctly');
});