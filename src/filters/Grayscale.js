(function(Filters) {
	
	Filters.Grayscale = function(imageData) {
		var data = imageData.data,
			idx = 0, length = data.length,
			brightness;
		for (; idx < length; idx += 4) {
			brightness = 0.34 * data[idx] + 0.5 * data[idx + 1] + 0.16 * data[idx + 2];

			data[idx] = brightness; // red
			data[idx + 1] = brightness; // green
			data[idx + 2] = brightness; // blue
		}
	};

}(Gear.Filters));
