// Tween adapted from sole.
// Biggest differences are
// - the separaration of Easing, Interpolation and the Engine
// - Tween utilizes Gear's utils
// - Tween is now prototypical; should yeild increased speed
//   and less garbage collection
// https://github.com/sole/tween.js/
(function(Gear, Easing, Interpolation) {

	var Tween = function(object) {
		this.object = object;
		this.valuesStart = this._fixProps({}, object);
		this.valuesEnd = {};
		this.valuesStartRepeat = {};
		this.duration = 1000;
		this.repeat = 0;
		this.delayTime = 0;
		this.startTime = null;
		this.onStartCallbackFired = false;
	};

	Tween.prototype = {

		// Defaults
		easingFunction: Gear.Easing.Linear.None,
		interpolationFunction: Gear.Interpolation.Linear,

		to: function(properties, duration) {
			if (duration !== undefined) {
				this.duration = duration;
			}

			this.valuesEnd = this._fixProps({}, properties);
			return this;
		},

		start: function(time) {
			Gear.TweenEngine.add(this);

			this.startTime = (time !== undefined) ? time : _.now();
			this.startTime += this.delayTime;

			var property;
			for (property in this.valuesEnd) {
				this.valuesStart[property] = this.object[property];
				this.valuesStartRepeat[property] = this.valuesStart[property] || 0;
			}

			return this;
		},

		stop: function() {
			Gear.TweenEngine.remove(this);
			return this;
		},

		delay: function(amount) {
			this.delayTime = amount;
			return this;
		},

		repeat: function(times) {
			this.repeat = times;
			return this;
		},

		easing: function(easing) {
			this.easingFunction = easing;
			return this;
		},

		interpolation: function(interpolation) {
			this.interpolationFunction = interpolation;
			return this;
		},

		chain: function() {
			this.chainedTweens = arguments;
			return this;
		},

		onStart: function(callback) {
			this.onStartCallback = callback;
			return this;
		},

		onUpdate: function(callback) {
			this.onUpdateCallback = callback;
			return this;
		},

		onComplete: function(callback) {
			this.onCompleteCallback = callback;
			return this;
		},

		update: function(time) {

			if (time < this.startTime) {
				return true;
			}

			if (this.onStartCallbackFired === false) {
				if (this.onStartCallback !== undefined) {
					this.onStartCallback.call(this.object);
				}

				this.onStartCallbackFired = true;
			}

			var elapsed = (time - this.startTime) / this.duration,
				value = this.easingFunction(elapsed),
				property;
				
			elapsed = (elapsed > 1) ? 1 : elapsed;

			for (property in this.valuesEnd) {
				var start = this.valuesStart[property] || 0,
					end = this.valuesEnd[property];

				this.object[property] = (start + (end - start) * value);
			}

			if (this.onUpdateCallback !== undefined) {
				this.onUpdateCallback.call(this.object, value);
			}

			if (elapsed === 1) {

				if (this.repeat > 0) {

					if (isFinite(this.repeat)) {
						this.repeat--;
					}

					// reassign starting values, restart by making startTime = now
					var key;
					for (key in this.valuesStartRepeat) {
						this.valuesStart[key] = this.valuesStartRepeat[key];
					}

					this.startTime = (time + this.delayTime);

					return true;

				} else {

					if (this.onCompleteCallback !== undefined) {
						this.onCompleteCallback.call(this.object);
					}

					if (this.chainedTweens !== undefined) {
						var idx = 0, numChainedTweens = this.chainedTweens.length;
						for (; idx < numChainedTweens; idx++) {
							this.chainedTweens[idx].start(time);
						}
					}

					return false;
				}
			}

			return true;
		},

		_fixProps: function(base, object) {
			// Set all starting values present on the target object
			var field;
			for (field in object) {
				base[field] = parseFloat(object[field], 10);
			}
			return base;
		},

		toString: function() {
			return '[Tween]';
		}
	};

	Gear.Tween = Gear.Global.WIN.Tween = Tween;

}(Gear, Gear.Easing, Gear.Interpolation));