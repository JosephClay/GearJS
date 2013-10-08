test('Object Existance', function() {
	ok(_, 'Underscore exists');
	ok(Gear, 'Gear exists');
	ok(Gear.Constants, 'Constants exists');
	ok(Gear.Global, 'Global exists');
		
	ok(_.exists, 'Mixins exists');
	ok(Gear.Util, 'Util exists');
	ok(Gear.id, 'Id exists');
	ok(Gear.Guid, 'Guid exists');
	ok(Gear.point, 'Point exists');
	ok(Gear.Plane, 'Plane exists');
	ok(Gear.Color, 'Color exists');
	ok(Gear.Math, 'Math exists');

	ok(Gear.Signal, 'Signal exists');
	ok(Gear.Tick, 'Tick exists');
		
	ok(Xaja, 'Xaja exists');

	ok(Gear.Resource, 'Resource exists');
	ok(Gear.Manifest, 'Manifest exists');
	ok(Gear.Asset, 'Asset exists');

	ok(Gear.Collection, 'Collection exists');
	ok(Gear.Transform, 'Transform exists');
	ok(Gear.Canvas, 'Canvas exists');
	ok(Gear.SceneCanvas, 'SceneCanvas exists');
	ok(Gear.HitCanvas, 'HitCanvas exists');
	ok(Gear.Node, 'Node exists');
	ok(Gear.Container, 'Container exists');
	ok(Gear.Shape, 'Shape exists');
	ok(Gear.Stage, 'Stage exists');
	ok(Gear.Layer, 'Layer exists');
	ok(Gear.Group, 'Group exists');
	ok(Gear.Animation, 'Animation exists');
	ok(Gear.Sprite, 'Sprite exists');
	ok(Gear.BitmapAnimation, 'BitmapAnimation exists');

	ok(Gear.Easing, 'Easing exists');
	ok(Gear.Interpolation, 'Interpolation exists');
	ok(Gear.TweenEngine, 'TweenEngine exists');
	ok(Gear.Tween, 'Tween exists');

	ok(Gear.Rect, 'Rect exists');
	ok(Gear.Circle, 'Circle exists');
	ok(Gear.Ellipse, 'Ellipse exists');
	ok(Gear.Wedge, 'Wedge exists');
	ok(Gear.Image, 'Image exists');
	ok(Gear.Polygon, 'Polygon exists');
	ok(Gear.Text, 'Text exists');
	ok(Gear.Line, 'Line exists');
	ok(Gear.Spline, 'Spline exists');
	ok(Gear.Blob, 'Blob exists');

	ok(Gear.Path, 'Path exists');
	ok(Gear.TextPath, 'TextPath exists');
	ok(Gear.RegularPolygon, 'RegularPolygon exists');
	ok(Gear.Star, 'Star exists');
	ok(Gear.Label, 'Label exists');
	ok(Gear.Tag, 'Tag exists');

	ok(Gear.Filters.Grayscale, 'Grayscale exists');
	ok(Gear.Filters.Brighten, 'Brighten exists');
	ok(Gear.Filters.Invert, 'Invert exists');
	ok(Gear.Filters.Blur, 'Blur exists');
	ok(Gear.Filters.Mask, 'Mask exists');
	ok(Gear.Filters.ShiftHue && Gear.Filters.Colorize, 'ColorPack exists');
	ok(Gear.Filters.UnsharpMask && Gear.Filters.SoftBlur && Gear.Filters.Edge && Gear.Filters.Emboss, 'ConvolvePack exists');
});