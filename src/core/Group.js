(function(Gear, Constants, Util) {
	
	/**
	 * Used to contain shapes or other groups.
	 * @param {Object} config
	 */
	var Group = function(config) {
		config = _.extend({}, this.defaults, config);
		Gear.Container.call(this, config);
		this.nodeType = Constants.NODE_TYPE.GROUP;
	};

	Group.extend = Util.extend;

	Util.construct(Group.prototype, Gear.Container.prototype, {
		_validateAdd: function(child) {
			var type = child.getType();
			if (type === Constants.NODE_TYPE.STAGE || type === Constants.NODE_TYPE.LAYER) {
				throw new Error('Stages and layers cannot be added to a group');
			}
		},

		toString: function() {
			return '[Group]';
		}
	});

	Gear.Group = Group;

}(Gear, Gear.Const, Gear.Util));
