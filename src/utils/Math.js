(function(Gear) {

	var Mth = {
		PI_OVER_DEG180: (Math.PI / 180),
		DEG180_OVER_PI: (180 / Math.PI),
		PIx2: (Math.PI * 2) - 0.0001, // the 0.0001 offset fixes a bug in Chrome 27
		MICRO_FLOAT: 0.00000001,

		degToRad: function(deg) {
			return (deg * Mth.PI_OVER_DEG180);
		},

		radToDeg: function(rad) {
			return (rad * Mth.DEG180_OVER_PI);
		}
	};

	Gear.Math = Mth;

}(Gear));