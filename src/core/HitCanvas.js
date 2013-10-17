(function(Gear, Util) {

	var HitCanvas = function(config) {
		Gear.Canvas.call(this, config);
	};

	Util.construct(HitCanvas.prototype, Gear.Canvas.prototype, {
		_fill: function(shape) {
			var context = this.getContext();

			this.save();
			context.fillStyle = shape.getColorId();
			context.fill();
			this.restore();
		},
		
		_stroke: function(shape) {
			var stroke = shape.getStroke();

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

}(Gear, Gear.Util));