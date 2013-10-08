test('Stage', function() {

	var blankStage = new Gear.Stage();
	ok(blankStage instanceof Gear.Stage, 'A stage can be created without configuration');
	blankStage.destroy();
	ok(!blankStage.getContainer() && !blankStage.getContent(), 'Stage can be destroyed');

	var stage = new Gear.Stage({
		container: 'Test1',
		width: 1000,
		height: 500
	});

    var layer = new Gear.Layer({
        name: 'TestLayer',
        auto: true,
        width: 1000,
        height: 500,
        x: 0,
        y: 0
    });

	stage.add(layer);

	ok(stage instanceof Gear.Stage, 'Stage created');
	ok(stage.getStage() instanceof Gear.Stage, 'Stage can be retrieved');
	ok(stage.nodeType === Gear.Constants.NODE_TYPE.STAGE, 'Stage is a node type of stage');
	
	ok(Gear.Global.stages.length, 'Stage has beed added to Global stages');
	
	ok(stage.add(new Gear.Layer()), 'Layer can be added to the stage');
	throws(function() { stage.add(new Gear.Node()); }, null, 'Non-layer objects cannot be added to the stage');
	
	ok(_.exists(stage.getContainer()), 'Container exists');
	ok(_.isString(stage.getContainer().innerHTML), 'Container is an element');
	ok(stage.getContainer().id === 'Test1', 'Test1 is the id of the stage element');

	ok(_.exists(stage.getContent()), 'Content exists');
	ok(_.isString(stage.getContent().innerHTML), 'Content is an element');
	ok(stage.getContent().style.width === '1000px', 'Content width set');
	ok(stage.getContent().style.height === '500px', 'Content height set');

	ok(stage.getChildren().length, 'Layer added to stage');
});

asyncTest('Stage: toDataURL', function() {
	expect(2);

	var stage = new Gear.Stage({
		width: 20,
		height: 20
	});

	stage.toDataURL({
		callback: function(url) {
			ok(_.isString(url), 'Data string generated');
			ok(url.indexOf('data:image') !== -1, 'Data URL defines a data:image');
			stage.destroy();
			start();
		}
	});

});

asyncTest('Stage: toImage', function() {
	expect(2);

	var stage = new Gear.Stage({
		width: 20,
		height: 20
	});

	stage.toImage({
		callback: function(image) {
			ok(_.isElement(image), 'Element generated');
			ok(image.tagName === 'IMG', 'Element is an image');
			stage.destroy();
			start();
		}
	});
});