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

	Fill.parse = function(config) {
		// Color
		if (_.isString(config)) {
			return new Gear.Fill.Color(config);
		}

		// Pattern
		if (_.exists(config.image) || _.exists(config.repeat)) {
			return new Gear.Fill.Pattern(config);
		}

		// Radial
		if (_.exists(config.startRadius) || _.exists(config.endRadius)) {
			return new Gear.Fill.RadialGradient(config);
		}

		// Linear
		if (_.exists(config.start) || _.exists(config.end)) {
			return new Gear.Fill.LinearGradient(config);
		}
	};

	Gear.Fill = Fill;

}(Gear));