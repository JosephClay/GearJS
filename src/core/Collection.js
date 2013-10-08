(function(Gear) {

	var Collection = function() {
		var arr = _.slice(arguments);
		arr = _.isArray(arr[0]) ? arr[0] : arr;
		
		var idx = 0, length = this.length = arr.length;

		for (; idx < length; idx += 1) {
			this[idx] = arr[idx];
		}
		return this;
	};
	
	Collection.toCollection = function(arr) {
		var collection = new Collection(),
			idx = 0, length = arr.length;

		for (; idx < length; idx += 1) {
			collection.push(arr[idx]);
		}
		return collection;
	};

	Collection.prototype = [];
	_.extend(Collection.prototype, {
		
		/**
		 * Iterate through node array and run a function for each node.
		 * The node and index is passed into the function.
		 */
		each: function(func) {
			var idx = 0, length = this.length;
			for (; idx < length; idx += 1) {
				func(this[idx], idx);
			}
		},

		toArray: function() {
			var arr = [],
				idx = 0, length = this.length;
			for (; idx < length; idx += 1) {
				arr.push(this[idx]);
			}
			return arr;
		},

		toString: function() {
			return '[Collection]';
		}
	});

	/**
	 * Map functions to Collection to apply
	 * to items within the Collection
	 */
	(function(arr) {
		
		var _mapMethod = function(method) {
			Collection.prototype[method] = function() {
				var args = _.slice(arguments),
					idx = 0, length = this.length;

				for (; idx < length; idx += 1) {
					this[idx][method].apply(this[idx], args);
				}
			};
		};
		
		var idx = 0, length = arr.length;
		for (; idx < length; idx++) {
			_mapMethod(arr[idx]);
		}

	}([
		'on',
		'off',
		'trigger',
		'remove',
		'destroy',
		'show',
		'hide',
		'move',
		'rotate',
		'moveToTop',
		'moveUp',
		'moveDown',
		'moveToBottom',
		'moveTo',
		'draw'
	]));

	Gear.Collection = Collection;

}(Gear));