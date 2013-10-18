/**
 * An easy way to subscribe to a tick with
 * a throttle framerate.
 *
 * Inspired from:
 * http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
 * Main comment preserved in tick subscription
 */
(function(Gear) {

	var Framerate = function(fps) {
		/**
		 * Our special Date.now() for tracking
		 * when a frame should fire. See tick
		 * subscription for more details
		 * @type {Number} ms
		 */
		this.then = null;
		this.tickId = null;
		this._tick = this._tick.bind(this);
		this.setFPS(fps);
	};

	Framerate.prototype = {

		on: function(name, callback) {
			if (!callback) { return; }

			this.then = _.now();
			this.callback = callback;

			this.tickId = Gear.Tick.subscribe('tick', this._tick);
		},

		off: function(name) {
			if (!this.tickId) { return; }
			Gear.Tick.unsubscribe('tick', this.tickId);
			this.tickId = null;
			this.callback = null;
		},

		_tick: function(e) {
			var delta = e.now - this.then;
			if (delta > this.interval) {
				// update time stuffs
				 
				// Just `then = now` is not enough.
				// Lets say we set fps at 10 which means
				// each frame must take 100ms
				// Now frame executes in 16ms (60fps) so
				// the loop iterates 7 times (16*7 = 112ms) until
				// delta > interval === true
				// Eventually this lowers down the FPS as
				// 112*10 = 1120ms (NOT 1000ms).
				// So we have to get rid of that extra 12ms
				// by subtracting delta (112) % interval (100).
				// Hope that makes sense.
				 
				this.then = e.now - (delta % this.interval);

				this.callback.call();
			}
		},

		setFPS: function(fps) {
			this.interval = (1000 / fps);
		}
	};

	Gear.Framerate = Framerate;

}(Gear));
