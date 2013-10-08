(function(Filters) {

	Filters.Brighten = function(imageData) {
		var brightness = this.getFilterBrightness(),
			data = imageData.data,
			idx = 0, length = data.length;
		for (; idx < length; idx += 4) {
			data[idx] += brightness; // red
			data[idx + 1] += brightness; // green
			data[idx + 2] += brightness; // blue
		}
	};

}(Gear.Filters));
