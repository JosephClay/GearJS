test('Id', function() {
	var startingId = Gear.id();
	ok(_.isNumber(startingId), 'Int id generated');
	ok(startingId === 1, 'id starts at 1 to be truthy');
	ok(Gear.id() === 2, 'ids are sequencial');
	
	ok(Gear.id('bar') === Gear.id('baz'), 'Ids can be differentiated by name');
	ok(!Gear.id._table, 'Ids are protected');
});
