/*
 * A global window resize function and location to get
 * window measurements to reduce bindings and DOM calls.
 */
(function(Gear, Global, Util) {
	
	var WindowResize = function() {
		Gear.Signal.call(this);
		this.dimensions = this._measure();
		this._bind();
	};

	Util.construct(WindowResize.prototype, Gear.Signal.prototype, {
		throttle: 100, // ms

		getDimensions: function() {
			return this.dimensions;
		},

		measure: function() {
			this.dimensions = this._measure();
			return this.dimensions;
		},

		update: function() {
			this._fire();
		},

		setThrottle: function(ms) {
			this.throttle = ms;
			this._unbind()._bind();
			return this;
		},

		destroy: function() {
			this._unbind();
			this.trigger('destroy');
		},

		_bind: function() {
			var t = null,
				self = this;

			Global.WIN.onresize = function() {
				if (t) { clearTimeout(t); }
				t = setTimeout(function() {
					self._fire();
				}, self.throttle);
			};

			return this;
		},

		_unbind: function() {
			Global.WIN.onresize = null;
			return this;
		},

		_fire: function() {
			var dimensions = this.dimensions = this.measure();
			this.trigger('resize', dimensions, new Date());
		},

		_measure: function() {
			return {
				width: Global.WIN.innerWidth,
				height: Global.WIN.innerHeight
			};
		}
	});

	Gear.WindowResize = new WindowResize();

}(Gear, Gear.Global, Gear.Util));