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
		},

		getImage: function() {
			return this._image;
		},
		setImage: function(img) {
			this._image = img;
			return this;
		},

		getRepeat: function() {
			return this._repeat;
		},
		setRepeat: function(repeat) {
			this._repeat = repeat;
			return this;
		},

		getStart: function() {
			return this._start;
		},
		setStart: function(point) {
			this._start = Gear.point.parse(point);
			return this;
		},

		getStartRadius: function() {
			return this._startRadius;
		},
		setStartRadius: function(radius) {
			this._startRadius = radius;
			return this;
		},

		getEnd: function() {
			return this._end;
		},
		setEnd: function(point) {
			this._end = Gear.point.parse(point);
			return this;
		},

		getEndRadius: function() {
			return this._endRadius;
		},
		setEndRadius: function(radius) {
			this._endRadius = radius;
			return this;
		},

		getColorStops: function() {
			return this._colorStops;
		},
		setColorStops: function(stops) {
			this._colorStops = this._buildColorStops(stops);
			return this;
		},

		toString: function() {
			return '[Fill]';
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

		return config;
	};

	Fill.isFill = function(fill) {
		if (fill instanceof Gear.Fill.Color) { return true; }
		if (fill instanceof Gear.Fill.Pattern) { return true; }
		if (fill instanceof Gear.Fill.RadialGradient) { return true; }
		if (fill instanceof Gear.Fill.LinearGradient) { return true; }
		return false;
	};

	Gear.Fill = Fill;

}(Gear));