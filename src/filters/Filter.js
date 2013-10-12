(function(Gear) {

	Gear.Filters = {}; // Filters namespace

	_.extend(Image.prototype, {
		// Filter support: Blur
		getFilterRadius: function() {
			var val = this.attr.filterRadius;
			return (!_.exists(val)) ? 0 : val;
		},
		setFilterRadius: function(val) {
			this.attr.filterRadius = val;
			this._isFilterApplied = false;
		},

		// Filter support: Brighten
		getFilterBrightness: function() {
			var val = this.attr.filterBrightness;
			return (!_.exists(val)) ? 0 : val;
		},
		setFilterBrightness: function(val) {
			this.attr.filterBrightness = val;
			this._isFilterApplied = false;
		},

		// Filter support: ColorPack - shift hue
		getFilterHueShiftDeg: function() {
			var val = this.attr.filterHueShiftDeg;
			return (!_.exists(val)) ? 0 : val;
		},
		setFilterHueShiftDeg: function(val) {
			this.attr.filterHueShiftDeg = val;
			this._isFilterApplied = false;
		},

		// Filter support: ColorPack - colorize
		getFilterColorizeColor: function() {
			var val = this.attr.filterColorizeColor;
			return (!_.exists(val)) ? [255, 0, 0] : val;
		},
		setFilterColorizeColor: function(val) {
			this.attr.filterColorizeColor = val;
			this._isFilterApplied = false;
		},

		// Filter support: ConvolvePack
		getFilterAmount: function() {
			var val = this.attr.filterAmount;
			return (!_.exists(val)) ? 50 : val;
		},
		setFilterAmount: function(val) {
			this.attr.filterAmount = val;
			this._isFilterApplied = false;
		},

		// Filter support: Mask
		getFilterThreshold: function() {
			var val = this.attr.filterThreshold;
			return (!_.exists(val)) ? 0 : val;
		},
		setFilterThreshold: function(val) {
			this.attr.filterThreshold = val;
			this._isFilterApplied = false;
		}
	});

}(Gear));