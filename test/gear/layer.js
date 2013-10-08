test('Layer', function() {

	var layer = new Gear.Layer();

	ok(layer instanceof Gear.Layer, 'layer created');

	layer.auto();
	ok(layer._tickId, 'layer subscribed to tick');
	layer.manual();
	ok(layer._tickId === null, 'layer unsubscribed from tick');
	
	ok(layer.getCanvas() instanceof Gear.SceneCanvas, 'scene canvas created');
	ok(layer.getHitCanvas() instanceof Gear.HitCanvas, 'hit canvas created');

});