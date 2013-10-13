// TODO: Unit test groups
test('Group', function() {

	var layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		group = new Gear.Group({
			width: 100,
			height: 100
		});

	layer.add(group);

	ok(group instanceof Gear.Group, 'group created');

});