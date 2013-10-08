(function(Gear) {

	var Manifest = function(name, manifest) {
		this.name = name || Gear.id('manifest'); // create a name for the manifest for Resource storage
		manifest = !manifest ? name : manifest; // name is not required. if it's ommitted, the manifest is actually the name
		this.manifest = _.isArray(manifest) ? manifest : [manifest];

		Gear.Signal.call(this);

		this.loaded = false;
		// The number of items that have been requested. This helps manage an overall progress without knowing how large the files are before they are downloaded.
		this._numItems = this._numItemsLoaded = 0;
		// An array containing the currently downloading files.
		this._currentLoads = [];
		// An array containing the queued items that have not yet started downloading.
		this._loadQueue = [];
		// An object hash of items that have finished downloading, indexed by item IDs.
		this._loadedItemsById = {};

		var self = this;
		this.on('complete', function() { Gear.Resource.load(self); });
	};

	_.extend(Manifest.prototype, Gear.Signal.prototype, {	
		// The number of maximum open connections that a loadQueue tries to maintain.
		_maxConnections: 3,

		setMaxConnections: function(connections) {
			this._maxConnections = connections;
		},

		load: function() {
			var manifest = this.manifest,
				idx = 0, length = manifest.length;
			for (; idx < length; idx += 1) {
				this._addItem(manifest[idx]);
			}

			idx = this._maxConnections;
			for (; idx >= 0; idx--) {
				this._loadNext();
			}
		},

		get: function(id) {
			var item = this._loadedItemsById[id];
			if (!item) { return null; }
			return item.result;
		},

		_addItem: function(value) {
			var asset = new Gear.Asset(value);
			
			this._loadedItemsById[asset.id] = asset;
			this._loadQueue.push(asset);

			this._numItems++;
		},

		_loadNext: function() {
			if (this._numItems === this._numItemsLoaded) {
				this.loaded = true;
				this.trigger('complete', this);
			}

			var queue = this._loadQueue,
				idx = 0, length = queue.length,
				handleComplete = this._handleComplete.bind(this);
			for (; idx < length; idx += 1) {
				if (this._currentLoads.length >= this._maxConnections) { break; }
				if (!queue[idx]) { return; }

	            queue[idx].load(handleComplete);
				queue.splice(idx, 1);
				idx -= 1; // because we spliced
			}
		},

		_handleComplete: function(asset) {
			this._numItemsLoaded++;

			this._removeLoadItem(asset);
			this._updateProgress(asset);

			this.trigger('load', asset);
			
			this._loadNext();
		},

		/**
		 * Overall progress has changed, so determine the new progress amount and dispatch it. This changes any time an
		 * item dispatches progress or completes. Note that since we don't know the actual filesize of items before they are
		 * loaded, and even then we can only get the size of items loaded with XHR. In this case, we define a 'slot' for
		 * each item (1 item in 10 would get 10%), and then append loaded progress on top of the already-loaded items.
		 *
		 * For example, if 5/10 items have loaded, and item 6 is 20% loaded, the total progress would be:
		 *      > 5/10 of the items in the queue (50%)
		 *      > plus 20% of item 6's slot (2%)
		 *      > equals 52%
		 */
		_updateProgress: function() {
			var loaded = (this._numItemsLoaded / this._numItems), // Fully Loaded Progress
				remaining = (this._numItems - this._numItemsLoaded);
			
			if (remaining > 0) {
				var chunk = 0,
					idx = 0, length = this._currentLoads.length;
				for (; idx < length; idx += 1) {
					chunk += this._currentLoads[idx].progress;
				}
				loaded += (chunk / remaining) * (remaining / this._numItems);
			}

			this.trigger('progress', loaded);
		},
		
		_removeLoadItem: function(asset) {
			var idx = 0, length = this._currentLoads.length;
			for (; idx < length; idx += 1) {
				if (this._currentLoads[idx] === asset) {
					this._currentLoads.splice(idx, 1);
					break;
				}
			}
		},

		toString: function() {
			return '[Manifest]';
		}
	});

	Gear.Manifest = Manifest;

}(Gear));