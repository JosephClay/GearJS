var Gear = {
	_VERSION: '0.1',
	Filters: {} // Filters namespace
};

// Uses Node, AMD or browser globals to create a module.
(function(root, factory) {

	if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but only
		// CommonJS-like enviroments that support module.exports
		return module.exports = factory();
	} 

	if (typeof define === 'function' && define.amd) {
		// AMD
		return define(factory);
	}

	// Browser globals (root is window)
	root.returnExports = factory();

}(this, function() {
	return Gear;
}));