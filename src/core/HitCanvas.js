(function(Gear) {

	var HitCanvas = function(config) {
		Gear.Canvas.call(this, config);
	};

	_.extend(HitCanvas.prototype, Gear.Canvas.prototype, {
		fill: function(shape) {
			var context = this.context;
			context.save();
			context.fillStyle = shape.getColorId();
			context.fill();
			context.restore();
		},
		
		stroke: function(shape) {
			var context = this.context,
				stroke = shape.getStroke(),
				strokeWidth = shape.getStrokeWidth();

			if (stroke || strokeWidth) {
				this._applyLineCap(shape);
				context.lineWidth = strokeWidth || 2;
				context.strokeStyle = shape.getColorId();
				context.stroke();
			}
		},

		toString: function() {
			return '[HitCanvas]';
		}
	});
	
	Gear.HitCanvas = HitCanvas;

}(Gear));