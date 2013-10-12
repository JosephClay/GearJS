(function(Global) {

	_.mixin({
		// Existance check.
		exists: function(value) {
			return (value === null || value === undefined) ? false : true;
		},

		// Centralized now function.
		// Prevents continuous testing across the
		// application and caches a reference to Date.
		// This is about 1% slower than using Date.now()
		// directly but elimates tests and the JIT compiler
		// should smooth/optimatize that 1%, making it trivial
		now: (function(Date) {
			return (Date.now) ? Date.now : function() {
				return new Date().getTime();
			};
		}(Date)),
		
		// Parse values in base 10.
		parseInt: function(value) {
			return parseInt(value, 10);
		},

		// faster Math.round using bitmath
		// http://stackoverflow.com/questions/8483357/why-is-math-round-in-javascript-slower-than-a-custom-built-function
		round: function(num) {
			var x = num % 1;
			return num - x + (x / 1 + 1.5 >> 1) * 1;
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

		// Cached slice helper for
		// duplicating arrays
		slice: (function(slice) {
			return function(param) {
				return slice.call(param);
			};
		}(Array.prototype.slice)),

		toPx: function(param) {
			return (+param) + 'px';
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