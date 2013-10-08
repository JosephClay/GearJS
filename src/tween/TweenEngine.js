(function(Gear) {

	var _tweens = [],
		_animRunning = false,
		_id;

	var _handleAnimation = function() {
		if (_animRunning) { return; }
		_animRunning = true;

		_id = Gear.Tick.subscribe('tick', _update);
	};

	var _update = function(time) {
		if (!_tweens.length) {
			_animRunning = false;
			Gear.Tick.unsubscribe('tick', _id);
			return false;
		}

		time = (time !== undefined) ? time : _.now();
		
		var idx = 0, numTweens = _tweens.length;
		while (idx < numTweens) {

			if (_tweens[idx].update(time)) {
				idx++;
			} else {
				_tweens.splice(idx, 1);
				numTweens--;
			}
		}

		return true;
	};

	var TweenEngine = {
		getAll: function() {
			return _tweens;
		},

		removeAll: function() {
			_tweens = [];
		},

		add: function(tween) {
			_tweens.push(tween);
			_handleAnimation();
		},

		remove: function(tween) {
			var idx = _tweens.indexOf(tween);
			if (idx !== -1) {
				_tweens.splice(idx, 1);
			}
		}
	};

	Gear.TweenEngine = TweenEngine;

}(Gear));