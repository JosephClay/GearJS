(function(Filters) {

	Filters.Invert = function(imageData) {
		var data = imageData.data,
			idx = 0, length = data.length;
		for (; idx < length; idx += 4) {
			data[idx] = (255 - data[idx]); // red
			data[idx + 1] = (255 - data[idx + 1]); // green
			data[idx + 2] = (255 - data[idx + 2]); // blue
		}
	};

}(Gear.Filters));
