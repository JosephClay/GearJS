test('Node', function() {
	var node = new Gear.Node(),
		layer = new Gear.Layer({
			opacity: 0.5
		});

	ok(node instanceof Gear.Node, 'Node created');
	ok(node.nodeType === Gear.Constants.NODE_TYPE.NODE, 'Node is a node type of node');
	ok(node.getType() === Gear.Constants.NODE_TYPE.NODE, 'nodeType matches NODE_TYPE constant');
	ok(node.getClassName() === 'Node', 'Node class is node');
	ok(_.isObject(node.attr), 'Node as attributes');
	ok(node.on && node.off && node.subscribe && node.unsubscribe && node.trigger && node.dispatch, 'Node is inheriting from Signal');
	ok(!node.getParent(), 'Node doesnt have a parent');

	layer.add(node);
	ok(layer.getChildren().length === 1, 'Node can be added to layer');
	ok(node.hasChildren() === false, 'Node doesnt have children');
	ok(!node.getChildren(), 'Node has no children');
	
	ok(node.getParent() instanceof Gear.Layer, 'Node has a parent layer');
	ok(node.getAncestors() instanceof Gear.Collection, 'getAncestors returns a collection');
	
	ok(node.index === 0, 'node.index is set');

	ok(node.getAbsoluteOpacity() === 0.5, 'Absolute opacity takes into account parent');
	ok(node.getTransform() instanceof Gear.Transform, 'getTransform returns a Gear.Trasform');

	ok(node.getVisible() === true, 'Visibility defaults to visible');
	node.setVisible(false);
	ok(node.getVisible() === false, 'Visibility set to false');
	node.setVisible(1);
	ok(node.getVisible() === true, 'Truthy value sets visible to true');
	node.setVisible(0);
	ok(node.getVisible() === false, 'Falsy value sets visible to false');
	node.show();
	ok(node.getVisible() === true, 'Show sets visibility to true');
	node.hide();
	ok(node.getVisible() === false, 'Hide sets visibility to false');
	node.show();
	ok(node.isVisible() === true, 'Node is visible');
	layer.setVisible(false);
	ok(node.isVisible() === false, 'Node is not visible because layer is not visible');
	layer.setVisible(true);
	ok(node.isVisible() === true, 'Node is visible again');

	ok(node.getLevel() === 1, 'Node is sitting 1 level deep (inside layer)');
	
	ok(_.isFunction(node.compose), 'Compose is present');
	ok(_.isFunction(node.__draw) && _.isFunction(node.__hit), 'Draw and hit are present');

	var node2 = new Gear.Node({
			x: 1,
			y: 1
		}),
		node3 = new Gear.Node();

	var node2Object = node2.toObject();
	ok(_.isObject(node2Object) && (node2Object.attr.x === 1 && node2Object.attr.y === 1), 'Node converted to object');
	deepEqual(node2.toObject(), node2.toJSON(), 'toObject and toJSON both return the same object');

	layer.add(node2).add(node3);
	ok(layer.getChildren().length === 3, '3 nodes in layer');

	ok(node.isListening() === false, 'Node is not listening by default');
	node.setListening(true);
	ok(node.isListening() === false, 'Node is not listening because layer is not listening');
	layer.setListening(true);
	ok(node.isListening() === true, 'Node is now listening');
	node.setListening(false);
	ok(node.isListening() === false, 'Node is no longer listening');
	
	ok(node.getCanvas() === null, 'Node is not in a stage, no canvas');
	ok(node.getContext() === null, 'Node is not in a stage, no context');
	ok(node.getLayer() instanceof Gear.Layer, 'Node found its layer to return');
	ok(node.getParent() instanceof Gear.Layer, 'Node found its parent to return');

	node2.moveUp();
	// node, node3, node2
	ok(node2.index === 2, 'node moved up');
	
	node2.moveDown();
	// node, node2, node3
	ok(node2.index === 1, 'node moved down');

	node2.moveToBottom();
	// node2, node, node3
	ok(node2.index === 0, 'node moved to bottom');

	node2.moveToTop();
	// node, node3, node2
	ok(node2.index === 2, 'node moved to top');

	var moveTolayer = new Gear.Layer();
	node2.moveTo(moveTolayer);
	ok(moveTolayer.getChildren().length === 1 && layer.getChildren().length === 2, 'Node moved from one layer to another');

	node2.remove();
	node3.remove();
	ok(layer.getChildren().length === 1, 'Nodes can be removed from parent');
	ok(node2.getLevel() === 0, 'Nodes with no parent are 0 levels deep');

	ok(true, 'Destroy is the same as remove');

	var fooNode = new Gear.Node({
			foo: 'bar'
		}),
		fooNodeClone = fooNode.clone();
	ok(fooNodeClone instanceof Gear.Node, 'clone returns a node');
	deepEqual(fooNode.attr, fooNodeClone.attr, 'Nodes attributes are the same');
	fooNodeClone.attr.foo = 'foo';
	notDeepEqual(fooNode.attr, fooNodeClone.attr, 'Nodes attributes can now be changed separately');
});
