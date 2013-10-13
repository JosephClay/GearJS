// TODO: Image unit tests
test('Image', function() {

	var img = new Image();
	img.src = 'data:image/gif;base64,R0lGODdhMgAyAOMAAMzMzJaWlpycnKOjo7e3t8XFxbGxsaqqqr6+vgAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAMgAyAAAEbRDISau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987/81wYBAEBAuQqLxJZAMCgOkE8ocRqOAgwGbvL4KgEETWwiAAWBx+HUcPMkChKT9ZgsMxWO4OL/ngYCBgoOEhYaHiImKi4yNjo+QgBEAOw==';

	var stage = new Gear.Stage({
			container: 'Test10',
			width: 100,
			height: 100,
		}),
		layer = new Gear.Layer({
			width: 100,
			height: 100
		}),
		image = new Gear.Image({
			image: img,
			x: 15,
			y: 15
		});

	stage.add(layer);
	layer.add(image);

	ok(image instanceof Gear.Image, 'image created');
});