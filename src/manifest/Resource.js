(function(Gear) {

	var Resource = (function() {
		
		var _resources = {};

		var _load = function(manifest) {
			_resources[manifest.name] = manifest;
		};

		var _get = function(name) {
			var item = _resources[name];
			return (_.exists(item)) ? item : null;
		};

		return {
			load: _load,
			get: _get,
			toString: function() {
				return '[Resource]';
			}
		};
	}());

	Gear.Resource = Resource;

}(Gear));