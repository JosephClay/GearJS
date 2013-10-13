test('Collection', function() {
	var collection = new Gear.Collection([1,2,3]);
	ok(collection instanceof Gear.Collection, 'collection created');
	ok(collection.length === 3, 'collection length correct');

	var total = 0;
	collection.each(function(item, idx) { total++; });
	ok(total === 3, 'each  iterator works');

	// Testing array basics to make sure Collection is inheriting
	// these methods correctly. No need to unit test every method in Array.prototype
	ok(collection[0] === 1, 'collection item can be referenced by index');
	ok(collection.indexOf(1) === 0, 'indexOf returns the correct index');

	ok(collection.join('.') === '1.2.3', 'collection can be joined');

	collection.unshift(0);
	ok(collection[0] === 0, 'collection can be unshifted');
	ok(collection.length === 4, 'collection length is up-to-date');
	ok(collection.shift() === 0, 'collection can be shifted');

	collection.push(4);
	ok(collection[3] === 4, 'collection can be pushed');
	ok(collection.length === 4, 'collection length is up-to-date');
	ok(collection.pop() === 4, 'collection can be popped');
	// /end array testing
	
	ok(_.isArray(collection.toArray()), 'toArray returns an array');
	deepEqual(collection.toArray(), [1,2,3], 'toArray returns an array with the correct contents');
});
