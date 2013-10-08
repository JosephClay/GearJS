(function(Gear) {

	/**
	 * Holds ids for the engine, but stores
	 * them under separate keys to keep the ids
	 * separate and managable.
	 * @type {Object}
	 */
	var _table = {};

	var Id = function(type) {
		type = type || '';

		var num = _table[type] || 0;
		num += 1;

		return (_table[type] = num);
	};

	Gear.id = Id;

}(Gear));