(function(Global) {

	_.mixin({
		// Existance check.
		exists: function(value) {
			return (value === null || value === undefined) ? false : true;
		},

		// Centralized now function.
		// Prevents continuous testing across the
		// application and caches a reference to Date.
		now: (function(Date) {
			return (Date.now) ? Date.now : function() {
				return new Date().getTime();
			};
		}(Date)),
		
		// Parse values in base 10.
		parseInt: function(value) {
			return parseInt(value, 10);
		},

		// Check if an elem is in the document
		isInDocument: function(elem) {
			while (elem = elem.parentNode) {
				if (elem === Global.DOC) {
					return true;
				}
			}
			return false;
		},

		// Shortcut for creating elements
		element: function(type, attributes) {
			var elem = Global.DOC.createElement(type);
			if (!attributes) { return elem; }

			var key;
			for (key in attributes) {
				elem[key] = attributes[key];
			}
			return elem;
		},

		slice: (function(slice) {
			return function(param) {
				return slice.call(param);
			};
		}(Array.prototype.slice)),

		toPx: function(param) {
			return param.toString() + 'px';
		},

		hasMethods: function(obj) {
			var key, val;
			for (key in obj) {
				val = obj[key];
				if (val && _.isFunction(val)) {
					return true;
				}
			}

			return false;
		},

		duplicate: function(obj) {
			return JSON.parse(JSON.stringify(obj));
		}
	});

}(Gear.Global));