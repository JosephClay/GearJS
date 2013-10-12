(function(Gear, Global) {

	// Request Animation Frame: intentionally encapsulated so that
	// we have a quick reference and don't pollute other implementations on the page
	var _requestAnimationFrame,
		_cancelAnimationFrame;
	(function(win) {
		var requestAnimationFrame = win.requestAnimationFrame,
			cancelAnimationFrame = win.cancelAnimationFrame,
			lastTime = 0,
			vendors = ['ms', 'moz', 'webkit', 'o'],
			idx = 0, length = vendors.length;

		if (!requestAnimationFrame) {
			for (; idx < length && !requestAnimationFrame; idx += 1) {
				requestAnimationFrame = (win[vendors[idx] + 'RequestAnimationFrame']);
				cancelAnimationFrame = (win[vendors[idx] + 'CancelAnimationFrame'] || win[vendors[idx] + 'CancelRequestAnimationFrame']);
			}
		}
	 
		if (!requestAnimationFrame) {
			requestAnimationFrame = function(callback) {
				var currTime = _.now(),
					timeToCall = Math.max(0, 16 - (currTime - lastTime)),
					id = setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
	 
		if (!cancelAnimationFrame) {
			cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}

		// Call within context of window (avoid Illegal Invocation error)
		_requestAnimationFrame = function(func) {
			return requestAnimationFrame.call(win, func);
		};
		_cancelAnimationFrame = function(dx) {
			return cancelAnimationFrame.call(win, id);
		};
	}(Global.WIN));

	/*
	 * Provides a centralized tick. Listeners can subscribe to the tick
	 * event to be notified when a set time interval has elapsed.
	 *
	 * Note that the interval that the tick event is called is a target interval, and may
	 * be broadcast at a slower interval during times of high CPU load.
	 */
	var Tick = function() {
		Gear.Signal.call(this);

		this._id = Gear.id('tick');
		
		this.eventObj = {};
		this._fps = 0;
		this._interval = 0;
		this._isPaused = false;
		this._pausedTicks = 0; // Number of ticks that have passed while Tick has been paused
		this._startTime = 0;
		this._pausedTime = 0;
		this._ticks = 0; // Number of ticks that have passed
		this._lastTime = 0;
		this._timeoutId = null;

		this.setFPS(60);
		this._request(); // Start er up!
	};

	/**
	 * Percentage variance so that the raf doesn't tick faster than allowed
	 * 0.97 allows for a 3% time variance between ticks
	 * @type {Number}
	 */
	Tick._VARIANCE = 0.97;

	_.extend(Tick.prototype, Gear.Signal.prototype, {
		
		/**
		 * Sets the target frames per second
		 * @param {Number} fps
		 */
		setFPS: function(fps) {
			this._fps = fps;
			this._interval = (1000 / fps);
			return this;
		},
		
		/**
		 * Returns the fps set
		 * @return {Number} fps
		 */
		getFPS: function() {
			return this._fps;
		},
		
		/**
		 * Set the paused value
		 * @param {Boolean} isPaused
		 */
		setPaused: function(isPaused) {
			this._isPaused = !!isPaused;
			return this;
		},
		
		/**
		 * Get the paused value
		 * @return {Boolean}
		 */
		getPaused: function() {
			return this._isPaused;
		},
		
		/**
		 * Shorthand methods for paused get and set
		 * @return {this}
		 */
		pause: function() {
			this.setPaused(true);
			return this;
		},
		play: function() {
			this.setPaused(false);
			return this;	
		},
		isPaused: function() {
			return this.getPaused();
		},

		/**
		 * Returns the number of milliseconds that have elapsed since initialization
		 * @param {Object} opts
		 * @param {Boolean} opts.excludeRunTime If true, paused time will be excluded from the result
		 * @return {Number} milliseconds
		 */
		getTime: function(opts) {
			opts = opts || {};
			return _.now() - this._startTime - (!opts.excludeRunTime ? this._pausedTime : 0);
		},

		/**
		 * Get the number of ticks since initialization
		 * @param {Object} opts
		 * @param {Boolean} opts.excludePause If true, paused time will be excluded from the result
		 * @return {Number} number of ticks
		 */
		getTicks: function(opts) {
			opts = opts || {};
			return this._ticks - (!opts.excludePause ? this._pausedTicks : 0);
		},
		
		_request: function() {
			var self = this;
			this._timeoutId = _requestAnimationFrame(function() {
				if (self._isTickAllowed()) {
					self._tick();
				}

				self._request();
			});

			return this;
		},

		_cancel: function() {
			if (!_.exists(this._timeoutId)) { return; }
			_cancelAnimationFrame(this._timeoutId);

			return this;
		},

		_isTickAllowed: function() {
			// Only run if enough time has elapsed, with a little bit of flexibility to
			// be early, because RAF seems to run a little faster than 60hz
			return (_.now() - this._lastTime >= (this._interval - 1) * Tick._VARIANCE);
		},
		
		_tick: function() {
			this._ticks += 1;
			
			var e = this.eventObj,
				time = _.now(),
				elapsedTime = (time - this._lastTime),
				paused = this._isPaused;
			
			if (paused) {
				this._pausedTicks += 1;
				this._pausedTime += elapsedTime;
			}
			this._lastTime = time;

			e.paused = paused;
			e.delta = elapsedTime;
			e.time = e.now = time;
			e.runTime = (time - this._pausedTime);

			this.dispatch('tick', e);
		},

		toString: function() {
			return '[Tick]';
		}
	});
	
	Gear.Tick = new Tick();

}(Gear, Gear.Global));