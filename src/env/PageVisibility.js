/**
 * Wonderful gist adapted from addyosmani
 * https://gist.github.com/addyosmani/1122546
 * 
 * isVis - v0.5.5 Aug 2011 - Page Visibility API Polyfill
 * Copyright (c) 2011 Addy Osmani
 * Dual licensed under the MIT and GPL licenses.
 */
(function(Gear, Global, Util) {

	var _win = Global.WIN,
		_doc = Global.DOC;

	var Visibly = {
		activePrefix: null,
		prefixes: ['webkit', 'ms'],
		props: ['VisibilityState', 'visibilitychange', 'Hidden'],

		visibleCallbacks: [],
		hiddenCallbacks: [],

		onVisible: function(_callback) {
			this.visibleCallbacks.push(_callback);
		},
		onHidden: function(_callback) {
			this.hiddenCallbacks.push(_callback);
		},

		isSupported: function() {
			return (this._supports(0) || this._supports(1));
		},
		_supports: function(index) {
			return ((this.prefixes[index] + this.props[2]) in _doc);
		},

		_runCallbacks: function(callbacks) {
			var idx = 0, length = callbacks.length;
			for (; idx < length; idx += 1) {
				callbacks[idx].call();
			}
		},

		_visible: function() {
			this._runCallbacks(this.visibleCallbacks);
		},
		_hidden: function() {
			this._runCallbacks(this.hiddenCallbacks);
		},

		_nativeSwitch: function() {
			var nativeSwitch = ((_doc[this.activePrefix + this.props[2]]) === true) ? this._hidden() : this._visible();
		},

		listen: function() {
			var self = this;
			try { // if no native page visibility support found..
				if (!this.isSupported()) {
					if (_doc.addEventListener) { // for browsers without focusin/out support eg. firefox, opera use focus/blur
						// _win used instead of doc as Opera complains otherwise
						_win.addEventListener('focus', this._visible, 1);
						_win.addEventListener('blur', this._hidden, 1);
					} else { // IE <10s most reliable focus events are onfocusin/onfocusout
						_doc.attachEvent('onfocusin', this._visible);
						_doc.attachEvent('onfocusout', this._hidden);
					}
				} else { // switch support based on prefix
					this.activePrefix = (this._supports(0) === undefined) ? this.prefixes[1] : this.prefixes[0];
					_doc.addEventListener(this.activePrefix + this.props[1], function() {
						self._nativeSwitch.apply(self, arguments);
					}, 1);
				}
			} catch (e) {}
		}
	};


	var Listener = function() {
		Gear.Signal.call(this);

		this._isVisible = true;
		this._bindVisibility();
	};

	Util.construct(Listener.prototype, Gear.Signal.prototype, {

		_bindVisibility: function() {
			var self = this;
			Visibly.onVisible(function() {
				self._isVisible = true;
				self.trigger('visible');
			});

			Visibly.onHidden(function() {
				self._isVisible = false;
				self.trigger('hidden');
			});
		},

		isVisible: function() {
			return this._isVisible;
		}
	});

	Gear.PageVisibility = new Listener();
	
	Visibly.listen();

}(Gear, Gear.Global, Gear.Util));
