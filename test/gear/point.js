test('Point', function() {
	var point = Gear.point({
		x: 1,
		y: 1,
		width: 1,
		height: 1
	});

	ok(point, 'Point created');

	ok(point.x === 1, 'accessing x directly works');
	ok(point.y === 1, 'accessing y directly works');
	
	ok(point.getX() === 1, 'x getter works');
	ok(point.getY() === 1, 'y getter works');

	point.setX(2);
	ok(point.getX() === 2, 'setting x works');
	
	point.setY(2);
	ok(point.getY() === 2, 'setting y works');
	
	point.set({
		x: 3,
		y: 3
	});
	ok(point.x === 3 && point.y === 3, 'point can be set with object');

	point.setX(4.5);
	point.setY(4.5);
	ok(point.x === 4.5 && point.y === 4.5, 'points can be set to a float');

	point.floor();
	ok(point.x === 4 && point.y === 4, 'points can be floored');
	
	var clone = point.clone();
	ok(point.equals(clone), 'a cloned pane is equal to its original');

	point.set({ x: 7, y: 7 });
	clone.set({ x: 8, y: 8 });
	ok(point.x === 7 && clone.x === 8, 'cloned points are separate');

	point.destroy();
	ok(point.x === 0 && point.y === 0, 'a destroyed point clears');
	
	deepEqual(point.toObject(), { x: 0, y: 0 }, 'toObject returns an object of values');
	deepEqual(point.toArray(), [0,0], 'toArray returns an object of values');
});