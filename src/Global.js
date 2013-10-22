(function(Gear, Constants, document, window) {

	Gear.Global = {
		// Cached document and window so that deeply scoped classes/functions
		// don't have to crawl all the way out of the namespace
		DOC: document,
		WIN: window,

		stages: [],
		shapes: {}, // shapes hash. rgb keys and shape values

		addClasses: function(obj) {
			_.extend(Constants.CLASS, obj);
		},

		addColors: function(obj) {
			_.extend(Constants.CLASS, obj); 
		},

		adjustTickVariance: function(perc) {
			// Protect this as much as possible
			// to keep from NaNing within raf
			if (perc < 0) { perc = 0; }
			if (perc > 1) { perc = 1; }
			Gear.Tick._VARIANCE = _.isNumber(perc) ? perc : Gear.Tick._VARIANCE;
		}
	};

}(Gear, Gear.Const, document, window));