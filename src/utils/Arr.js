(function(Gear) {

	var _arrays = [];
	
	var _recycle = function() {
		// this = Array
		this.length = 0;
		_arrays.push(this);
	};

	var _arrayFactory = function() {
		var arr;

		if (_arrays.length) {
			return _arrays.pop();
		}

		arr = [];
		arr.recycle = _recycle;

		return arr;
	};

	Gear.Arr = _arrayFactory;

}(Gear));