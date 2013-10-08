test('Container', function() {
	var container = new Gear.Container();

	ok(container instanceof Gear.Container, 'Container created');
	ok(container.getChildren() instanceof Gear.Collection, 'children are a collection');

	var node1 = new Gear.Node(),
		node2 = new Gear.Node(),
		node3 = new Gear.Node();
	container.add(node1).add(node2).add(node3);
	ok(container.getChildren().length === 3, 'children added individually');

	container.removeChildren();
	ok(container.getChildren().length === 0, 'children removed');

	container.add([ node1, node2, node3 ]);
	ok(container.getChildren().length === 3, 'children added as array');
	
	ok(node1.index === 0 && node2.index === 1 && node3.index === 2, 'nodes are indexed');
	ok(container.isAncestorOf(node1) === true, 'container is an ancestor of its children');

	container.destroyChildren();
	ok(container.getChildren().length === 0, 'children removed');
});