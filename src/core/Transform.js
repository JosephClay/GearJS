(function(Gear) {

	var Transform = function() {
		this.m = [1, 0, 0, 1, 0, 0];
	};

	Transform.prototype = {

		reset: function() {
			this.m = [1, 0, 0, 1, 0, 0];
			return this;
		},

		// Apply translation
		translate: function(x, y) {
			this.m[4] += this.m[0] * x + this.m[2] * y;
			this.m[5] += this.m[1] * x + this.m[3] * y;
			return this;
		},

		// Apply scale
		scale: function(sx, sy) {
			this.m[0] *= sx;
			this.m[1] *= sx;
			this.m[2] *= sy;
			this.m[3] *= sy;
			return this;
		},

		// Apply rotation
		rotate: function(rad) {
			var c = Math.cos(rad),
				s = Math.sin(rad),
				m11 = this.m[0] * c + this.m[2] * s,
				m12 = this.m[1] * c + this.m[3] * s,
				m21 = this.m[0] * -s + this.m[2] * c,
				m22 = this.m[1] * -s + this.m[3] * c;
			this.m[0] = m11;
			this.m[1] = m12;
			this.m[2] = m21;
			this.m[3] = m22;
			return this;
		},

		// Returns the translation
		getTranslation: function() {
			return {
				x: this.m[4],
				y: this.m[5]
			};
		},

		// Apply skew
		skew: function(sx, sy) {
			var m11 = this.m[0] + this.m[2] * sy,
				m12 = this.m[1] + this.m[3] * sy,
				m21 = this.m[2] + this.m[0] * sx,
				m22 = this.m[3] + this.m[1] * sx;
			this.m[0] = m11;
			this.m[1] = m12;
			this.m[2] = m21;
			this.m[3] = m22;
			return this;
		 },

		// Transform multiplication
		multiply: function(matrix) {
			var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1],
				m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1],

				m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3],
				m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3],

				dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4],
				dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

			this.m[0] = m11;
			this.m[1] = m12;
			this.m[2] = m21;
			this.m[3] = m22;
			this.m[4] = dx;
			this.m[5] = dy;
			return this;
		},

		// Invert the matrix
		invert: function() {
			var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]),
				m0 = this.m[3] * d,
				m1 = -this.m[1] * d,
				m2 = -this.m[2] * d,
				m3 = this.m[0] * d,
				m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]),
				m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
			this.m[0] = m0;
			this.m[1] = m1;
			this.m[2] = m2;
			this.m[3] = m3;
			this.m[4] = m4;
			this.m[5] = m5;
			return this;
		},

		// return matrix
		getMatrix: function() {
			return this.m;
		},

		// set to absolute position via translation
		setAbsolutePosition: function(x, y) {
			var m0 = this.m[0],
				m1 = this.m[1],
				m2 = this.m[2],
				m3 = this.m[3],
				m4 = this.m[4],
				m5 = this.m[5],
				yt = ((m0 * (y - m5)) - (m1 * (x - m4))) / ((m0 * m3) - (m1 * m2)),
				xt = (x - m4 - (m2 * yt)) / m0;

			this.translate(xt, yt);
			return this;
		},

		toString: function() {
			return '[Transform]';
		}
	};

	Gear.Transform = Transform;

}(Gear));