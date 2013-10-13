test('Color', function() {
	var Color = Gear.Color;
	
	deepEqual(Color.toRGB('#ffffff'), { r: 255, g: 255, b: 255 }, 'To rgb on #ffffff');
	deepEqual(Color.toRGB('#000000'), { r: 0, g: 0, b: 0 }, 'To rgb on #000000');
	deepEqual(Color.toRGB('blue'), { r: 0, g: 0, b: 255 }, 'To rgb on blue');
	deepEqual(Color.toRGB('rgb(0,0,0)'), { r: 0, g: 0, b: 0 }, 'To rgb on rgb(0,0,0)');
	
	var rand1 = Color.getRandom();
	ok(_.isString(rand1) && rand1[0] === '#' && rand1.length === 7, 'Random color generated');
	ok(Color.getRandom() !== Color.getRandom() !== Color.getRandom(), 'Multiple random colors are not the same');
	
	ok(Color.rgbToHex(0,0,0) === '000000', 'rgb to hex on 0,0,0');
	ok(Color.rgbToHex(255,255,255) === 'ffffff', 'rgb to hex on 255,255,255');

	deepEqual(Color.hexToRgb('#ffffff'), { r: 255, g: 255, b: 255 }, 'hex to rgb on #ffffff');
	deepEqual(Color.hexToRgb('#000000'), { r: 0, g: 0, b: 0 }, 'hex to rgb on #000000');
});