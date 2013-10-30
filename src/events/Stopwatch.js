(function(Gear) {

	var _ONEHOUR = 1000 * 60 * 60,
		_ONEMIN  = 1000 * 60,
		_ONESEC  = 1000,
		_tokenRegex = /([{\;\d\w}])+/g,
		_template = '{hr}:{min}:{sec}';

	var Stopwatch = Gear.Signal.extend(function(config) {
		config = config || {};

		this.startTime = 0;
		this.stopTime = 0;
		this.totalElapsed = 0;

		this._template = config.template || _template;
		this._isStarted = false;
		this._framerate = new Gear.Framerate(config.fps || 30);
	}, {

		isRunning: function() {
			return this._isStarted;
		},

		start: function() {
			if (this.isRunning()) { return this; }
			this._isStarted = true;

			this.startTime = _.now();
			this.stopTime = 0;
			
			this._framerate.on('tick', this.tick.bind(this));
			return this;
		},
		resume: function() {
			this.start();
		},

		stop: function() {
			if (!this.isRunning() || !this._tickId) { return this; }
			this._isStarted = false;

			this.stopTime = _.now();
			var elapsed = this.stopTime - this.startTime;
			this.totalElapsed += elapsed;

			this._framerate.off('tick');

			return this;
		},
		pause: function() {
			this.stop();
		},

		reset: function() {
			this.totalElapsed = 0;
			this.stopTime = this.startTime = _.now();
		},

		restart: function() {
			this.stop();
			this.reset();
			this.start();
		},

		tick: function(e) {
			this.trigger('tick', this.getElapsed());
		},

		getElapsed: function() {
			var elapsed = 0;
			// If the watch is running, use now
			if (this.isRunning()) {
				elapsed = _.now() - this.startTime;
			}
			elapsed += this.totalElapsed;
			
			var hours = _.parseInt(elapsed / _ONEHOUR);
			elapsed %= _ONEHOUR;
			var mins = _.parseInt(elapsed / _ONEMIN);
			elapsed %= _ONEMIN;
			var secs = _.parseInt(elapsed / _ONESEC);
			var ms = elapsed % _ONESEC;
			
			return {
				hr: hours,
				min: mins,
				sec: secs,
				ms: ms
			};
		},

		setElapsed: function(hours, mins, secs, ms) {
			if (_.isObject(hours)) {
				var config = hours;
				this._setElapsed(config.hr, config.min, config.sec, config.ms);
				return;
			}
		
			this._setElapsed(hours, mins, secs);
		},

		_setElapsed: function(hours, mins, secs, ms) {
			this.reset();
			this.totalElapsed = (ms || 0);
			this.totalElapsed += (hours || 0) * _ONEHOUR;
			this.totalElapsed += (mins  || 0) * _ONEMIN;
			this.totalElapsed += (secs  || 0) * _ONESEC;
			this.totalElapsed = Math.max(this.totalElapsed, 0); // prevent negative numbers
		},

		setFPS: function(fps) {
			this._framerate.setFPS(fps);
		},

		toString: function() {
			var self = this,
				elapsed = this.getElapsed();

			return this._template.replace(_tokenRegex, function(match) {
				var interior = match.substring(1, match.length - 1),
					interiorArr = interior.split(';'),
					key = interiorArr[0],
					digits = ~~interiorArr[1] || 1;

				return (digits > 1) ? self._padString(elapsed[key], digits) : elapsed[key];
			});
		},

		_padString: function(num, digits) {
			num = num.toString();
			while (num.length < digits) {
				num = '0' + num;
			}
			return num;
		}
	});

	Gear.Stopwatch = Stopwatch;
	
}(Gear));