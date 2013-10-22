/**
 * Based on Signal.js: https://github.com/JosephClay/Signal
 */
(function(Gear, Constants) {

	var _NAME_REGEX = /\w([^:\.])*/g,
		_NAME = 'signal',
		_splicer = ([]).splice;

	var Signal = function() {
		this._active = {};
		this._inactive = {};
		this._subid = 0;
		this._subscriptions = {};
	};
	
	Signal.extend = Gear.Util.extend;

	Signal.construct = function() {
		return new Signal();
	};

	Signal.prototype = {

		subscribe: function(name, func) {
			var id = Gear.id(_NAME),
				location = this._subscriptions[name] || (this._subscriptions[name] = []);

			func.__subid__ = id;
			location.push(func);

			return id;
		},

		unsubscribe: function(name, id) {
			var location = this._subscriptions[name];
			if (!location) { return; }

			var idx = 0, length = location.length;
			for (; idx < length; idx += 1) {
				if (location[idx].__subid__ === id) {
					location.splice(idx, 1);
					return true;
				}
			}

			return false;
		},

		dispatch: function() {
			var args = arguments,
				name = _splicer.call(args, 0, 1)[0],
				location = this._subscriptions[name] || (this._subscriptions[name] = []),
				idx = 0, length = location.length;
			for (; idx < length; idx += 1) {
				location[idx].apply(null, args);
			}
		},

		/* Disable | Enable *************************************/
		disable: function(handle) {
			this._inactive[handle] = this._inactive[handle] || {};
			this._inactive[handle] = _.extend({}, this._active[handle]);
			delete this._active[handle];

			return this;
		},

		enable: function(handle) {
			this._active[handle] = this._active[handle] || {};
			this._active[handle] = _.extend({}, this._inactive[handle]);
			delete this._inactive[handle];

			return this;
		},

		/* On | Off ************************************************/
		on: function(eventname, callback) {
			var eventConfig = this._getEventConfig(eventname),
				location = this._createEventLocation(eventConfig);
			
			location.push(callback);

			return this;
		},
		off: function(eventname) {
			var eventConfig = this._getEventConfig(eventname);
			if (eventConfig.hasNamespace) { // Has a namespace
				this._active[eventConfig.handle][eventConfig.evt][eventConfig.namespace].length = 0;
			} else { // Does not have a namespace
				this._active[eventConfig.handle][eventConfig.evt] = { '': [] };
			}

			return this;
		},
		once: function(eventname, callback) {
			return this.on(eventname, _.once(callback));
		},

		/* Trigger ************************************************/
		trigger: function() {
			var args = arguments,
				eventname = _splicer.call(args, 0, 1)[0],
				eventConfig = this._getEventConfig(eventname),
				location = this._getEventLocation(eventConfig);

			if (!location) { return this; }

			if (eventConfig.hasNamespace) { // If there's a namespace, trigger only that array
				this._callEventArray(location, args);
			} else { // Else, trigger everything registered to the event
				var subSignal = this._active[eventConfig.handle][eventConfig.evt], key;
				for (key in subSignal) {
					this._callEventArray(subSignal[key], args);
				}
			}

			return this;
		},

		/* ListenTo | StopListening ********************************/
		listenTo: function(obj, eventname, callback) {
			obj.on(eventname, callback);
			return this;
		},
		stopListening: function(obj, eventname) {
			obj.off(eventname);
			return this;
		},

		/* Private *************************************************/
		_getEvent: function(eventname) {
			// Ensure the location exists and return the event
			return this._createEventLocation(this._getEventConfig(eventname));
		},

		_callEventArray: function(events, args) {
			args = args || [];

			var idx = 0, length = events.length,
				evt;
			for (; idx < length; idx += 1) {
				evt = events[idx];
				if (!evt) { continue; }
				if (evt.apply(null, args) === false) { return; }
			}
		},

		_getEventConfig: function(eventname) {
			var hasHandle = (eventname.indexOf(':') !== -1) ? true : false,
				hasNamespace = (eventname.indexOf('.') !== -1) ? true : false,
				matches = eventname.match(_NAME_REGEX),
				eventConfig = {};

			if (hasHandle && hasNamespace) { // Has handle, event, namespace
				
				eventConfig.handle = matches[0];
				eventConfig.evt = matches[1];
				eventConfig.namespace = matches[2];

			} else if (hasHandle && !hasNamespace) { // Has handle and event
				
				eventConfig.handle = matches[0];
				eventConfig.evt = matches[1];
				eventConfig.namespace = '';

			} else if (hasNamespace && !hasHandle) { // Has event and namespace
				
				eventConfig.handle = '';
				eventConfig.evt = matches[0];
				eventConfig.namespace = matches[1];

			} else { // Has event
				
				eventConfig.handle = '';
				eventConfig.evt = matches[0];
				eventConfig.namespace = '';

			}

			eventConfig.hasHandle = hasHandle;
			eventConfig.hasNamespace = hasNamespace;

			return eventConfig;
		},

		_getEventLocation: function(eventConfig, location) {
			location = location || this._active;

			var handle = location[eventConfig.handle];
			if (!handle) { return; }

			var evts = handle[eventConfig.evt];
			if (!evts) { return; }

			if (!eventConfig.hasNamespace) { return evts; }

			var namespace = evts[eventConfig.namespace];
			if (!namespace) { return; }

			// Return the location
			return namespace;
		},

		_createEventLocation: function(eventConfig, location) {
			location = location || this._active;

			var handle = location[eventConfig.handle] || (location[eventConfig.handle] = {}),
				evt = handle[eventConfig.evt] || (handle[eventConfig.evt] = {}),
				namespace = evt[eventConfig.namespace] || (evt[eventConfig.namespace] = []);

			return namespace;
		},

		/**
		 * Trigger and bubble an event on a node.
		 * Simulates DOM-like bubbling of events, allowing for
		 * bindings on low-level nodes
		 * 
		 * @param  {String} eventName
		 * @param  {Event} e
		 * @param  {Boolean} compareShape
		 */
		triggerAndBubble: function(eventName, e, compareNode) {
			if (e && this.nodeType === Constants.NODE_TYPE.SHAPE) {
				e.targetNode = this;
			}

			if (compareNode && this._id === compareNode._id) {
				if (eventName === Constants.EVT.MOUSEENTER || eventName === Constants.EVT.MOUSELEAVE) {
					return; // not okay to run
				}
			}

			this.trigger(eventName, e);

			// simulate event bubbling
			if (e && !e.cancelBubble && this.parent) {
				if (compareNode && compareNode.parent) {
					this.triggerAndBubble.call(this.parent, eventName, e, compareNode.parent);
				} else {
					this.triggerAndBubble.call(this.parent, eventName, e);
				}
			}
		},

		toString: function() {
			return '[Signal]';
		}
	};

	Gear.Signal = Signal;

}(Gear, Gear.Const));