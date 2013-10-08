(function(Gear) {

	/**
	 * @example:
	 * var guid = new Guid(); // Blank
	 * var guid = new Guid().create(); // string
	 * var guid = new Guid(string'');
	 * var guid = new Guid(byteArray[]);
	 */
	var Guid = (function() {

		var _byteToHex = [],
			_hexToByte = {};
		(function() {
			var idx = 0;
			for (; idx < 256; idx += 1) {
				_byteToHex[idx] = (idx + 0x100).toString(16).substr(1);
				_hexToByte[_byteToHex[idx]] = idx;
			}
		}());

		// Random byte generator repurposed from original node implementation for the client-side
		// https://github.com/broofa/node-uuid/blob/master/uuid.js
		var _holder = [];
		var _generate = function() {
			var idx = 0, r;
			for (; idx < 16; idx += 1) {
				if ((idx & 0x03) === 0) {
					r = Math.random() * 0x100000000;
				}
				_holder[idx] = r >>> ((idx & 0x03) << 3) & 0xff;
			}

			return _holder.slice();
		};

		var _PARSE_REGEX = /[0-9a-f]{2}/g,
			_VALIDATION_CHECK = /([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}/;

		var Guid = function(arg) {
			if (this === Gear.Global.WIN) { return new Guid(arg); }
			
			this.string = this.BLANK_STRING;
			this.byteArray = this.BLANK_BYTE_ARRAY;

			// If a Guid is passed as an argument,
			// that's fine, but throw a warning so that
			// the developer knows that they may have duplicate Guids
			if (arg instanceof Guid) {
				console.warn('Guid was passed as a Guid argument. Cloned Guid.');
				this.string = arg.toString();
				this.byteArray = arg.toByteArray();
				return this;
			}
			
			// A string Guid is going to be the most common
			// senario
			if (_.isString(arg) && this.isValid(arg)) {
				this.string = arg;
				this.byteArray = this.parse(arg);
				return this;
			}

			if (_.isArray(arg)) {
				var tempStr = this.unparse(arg);
				if (this.isValid(tempStr)) {
					this.string = tempStr;
					this.byteArray = arg;
				}
			}
		};

		Guid.prototype = {
			BLANK_STRING: '00000000-0000-0000-0000-000000000000',
			BLANK_BYTE_ARRAY: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

			parse: function(str) {
				if (!_.isString(str)) { return console.log('Cannot parse. Parameter must be a string.'); }
				if (!this.isValid(str)) { return console.log('String is not a valid Guid.'); }
				
				var idx = 0,
					byteArr = [];
				str.toLowerCase().replace(_PARSE_REGEX, function(oct) {
					if (idx < 16) { // Don't overflow!
						byteArr[idx++] = _hexToByte[oct];
					}
				});

				while (idx < 16) {
					// Zero out remaining bytes if string was short
					byteArr[idx++] = 0;
				}

				return byteArr;
			},

			unparse: function(arr) {
				if (!_.isArray(arr)) { return console.log('Cannot parse. Parameter must be an array'); }
				if (arr.length !== 16) { return console.log('Array is not a valid byte array'); }

				var idx = 0;
				return  _byteToHex[arr[idx++]] + _byteToHex[arr[idx++]] +
						_byteToHex[arr[idx++]] + _byteToHex[arr[idx++]] + '-' +
						_byteToHex[arr[idx++]] + _byteToHex[arr[idx++]] + '-' +
						_byteToHex[arr[idx++]] + _byteToHex[arr[idx++]] + '-' +
						_byteToHex[arr[idx++]] + _byteToHex[arr[idx++]] + '-' +
						_byteToHex[arr[idx++]] + _byteToHex[arr[idx++]] +
						_byteToHex[arr[idx++]] + _byteToHex[arr[idx++]] +
						_byteToHex[arr[idx++]] + _byteToHex[arr[idx++]];
			},

			toByteArray: function(str) {
				str = str || this.string;
				return this.parse(str);
			},

			toString: function(arr) {
				arr = arr || this.byteArray;
				return this.unparse(arr);
			},

			isValid: function(str) {
				str = str || this.string;
				return _VALIDATION_CHECK.test(str);
			},

			isEqual: function(guid) {
				guid = new Guid(guid);
				return (this.toString() === guid.toString());
			},
			
			create: function() {
				this.byteArray = _generate();
				this.string = this.toString(this.byteArray);
				return this.string;
			},

			toJSON: function(key) {
				return this.string;
			}
		};

		Guid.isValid = Guid.prototype.isValid;

		return Guid;

	}());

	Gear.Guid = Guid;

}(Gear));