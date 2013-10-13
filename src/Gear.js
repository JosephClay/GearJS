/**
 * A light and fast 2D game framework for HTML5 games
 * @project GearJS
 * @version 0.0.1
 * @copyright 2013 (c) Joseph Clay <testingriven@gmail.com>
 * @license MIT <http://opensource.org/licenses/MIT>
 */
var Gear = {
	_VERSION: '0.1',
	Sprocket: {}
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