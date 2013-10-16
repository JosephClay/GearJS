(function(Gear) {

	var _objects = [];
	
	var _recycle = function() {
		// this = Object
		var key;
		for (key in this) {
			delete this[key];
		}
		_objects.push(this);
	};

	var _objectFactory = function() {
		var obj;

		if (_objects.length) {
			return _objects.pop();
		}

		obj = [];
		obj.recycle = _recycle;

		return obj;
	};

	Gear.Obj = _objectFactory;

}(Gear));