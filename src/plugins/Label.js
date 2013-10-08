(function(Gear, Constants) {

	var _attrChangeList = ['fontFamily', 'fontSize', 'fontStyle', 'padding', 'lineHeight', 'text'],
		_attrChangeListLength = _attrChangeList.length;

	/**
	 * Label constructor. Labels are groups that contain a Text and Tag shape
	 * @param {Object} config
	 * // create label
	 * var label = new Label({
	 *   x: 100,
	 *   y: 100, 
	 *   draggable: true
	 * });
	 *
	 * // add a tag to the label
	 * label.add(new Gear.Tag({
	 *   fill: '#bbb',
	 *   stroke: '#333',
	 *   shadowColor: 'black',
	 *   shadowBlur: 10,
	 *   shadowOffset: [10, 10],
	 *   shadowOpacity: 0.2,
	 *   lineJoin: 'round',
	 *   pointerDirection: 'up',
	 *   pointerWidth: 20,
	 *   pointerHeight: 20,
	 *   cornerRadius: 5
	 * }));
	 *
	 * // add text to the label
	 * label.add(new Gear.Text({
	 *   text: 'Hello World!',
	 *   fontSize: 50,
	 *   lineHeight: 1.2,
	 *   padding: 10,
	 *   fill: 'green'
	 *  }));
	 */
	var Label = function(config) {
		Gear.Group.call(this, config);
		this._className = Constants.CLASS.LABEL;

		var self = this;
		this.on('add.gear', function(evt) {
			self._addListeners(evt.child);
			self._sync();
		});
	};

	_.extend(Label.prototype, Gear.Group.prototype, {

		// Get Text shape for the label. You need to access the Text shape in order to
		// update the text properties
		getText: function() {
			return this.get('Text')[0];
		},

		// Get Tag shape for the label. You need to access the Tag shape in order to update
		// the pointer properties and the corner radius
		getTag: function() {
			return this.get('Tag')[0];
		},

		_addListeners: function(context) {
			var self = this,
				sync = function() { self._sync(); },
				idx = 0;

			// update text data for certain attr changes
			for (; idx < _attrChangeListLength; idx += 1) {
				context.on(_attrChangeList[idx] + Constants.CHANGE_GEAR, sync);
			}
		},

		getWidth: function() {
			return this.getText().getWidth();
		},

		getHeight: function() {
			return this.getText().getHeight();
		},

		_sync: function() {
			var text = this.getText(),
				tag = this.getTag();

			if (!text || !tag) { return; }

			var width = text.getWidth(),
				height = text.getHeight(),
				pointerWidth = tag.getPointerWidth(),
				pointerHeight = tag.getPointerHeight(),
				x = 0,
				y = 0;

			switch (tag.getPointerDirection()) {
				case Constants.UP:
					x = width / 2;
					y = pointerHeight * -1;
					break;
				case Constants.RIGHT:
					x = width + pointerWidth;
					y = height / 2;
					break;
				case Constants.DOWN:
					x = width / 2;
					y = height + pointerHeight;
					break;
				case Constants.LEFT:
					x = pointerWidth * -1;
					y = height / 2;
					break;
			}

			tag.setSize({
					width: width,
					height: height
				})
				.setX(x * -1)
				.setY(y * -1);

			text.setX(x * -1)
				.setY(y * -1);
		}
	});

	Gear.Label = Label;

}(Gear, Gear.Constants));
