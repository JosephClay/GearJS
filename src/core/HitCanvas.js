(function(Gear) {

	var HitCanvas = function(config) {
		Gear.Canvas.call(this, config);
	};

	_.extend(HitCanvas.prototype, Gear.Canvas.prototype, {
		_fill: function(shape) {
			var context = this.getContext();

			context.save();
			context.fillStyle = shape.getColorId();
			context.fill();
			context.restore();
		},
		
		_stroke: function(shape) {
			var context = this.getContext(),
				stroke = shape.getStroke();

			if (!stroke || !stroke.isEnabled()) { return; }

			var style = stroke.getStyle();
			stroke.setStyle(shape.getColorId());

			stroke.stroke();
			
			stroke.setStyle(style);
		},

		toString: function() {
			return '[HitCanvas]';
		}
	});
	
	Gear.HitCanvas = HitCanvas;

}(Gear));