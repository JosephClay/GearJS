(function(Gear) {
	
	var Fill = function(config) {
		this._isEnabled = _.isBoolean(config.isEnabled) ? config.isEnabled : true;
	};

	Fill.prototype = {
		isEnabled: function() {
			return this._isEnabled;
		},

		enable: function() {
			this._isEnabled = true;
		},

		disable: function() {
			this._isEnabled = false;
		}
	};

	Gear.Fill = Fill;

}(Gear));