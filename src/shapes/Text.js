(function(Gear, Constants, Util) {

	var _attrChangeList = ['fontFamily', 'fontSize', 'fontStyle', 'padding', 'align', 'lineHeight', 'text', 'width', 'height', 'wrap'],
		_attrChangeListLength = _attrChangeList.length,
		_dummyContext = _.element(Constants.CANVAS).getContext(Constants.CONTEXT_2D);

	/**
	 * Display text
	 * @param {Object} config
	 * @param {String} config.text
	 * @param {Number} [config.padding]
	 * @param {Number} [config.width] default is auto
	 * @param {Number} [config.height] default is auto
	 * @param {String} [config.fontFamily] default is Calibri
	 * @param {Number} [config.fontSize] in pixels. Default is 12
	 * @param {String} [config.fontStyle] can be normal, bold, or italic. Default is normal
	 * @param {String} [config.align] can be left, center, or right
	 * @param {String} [config.wrap] word, char, or none. Default is word
	 * @param {Number} [config.lineHeight] default is 1
	 * @example
	 * var text = new Gear.Text({
	 *   x: 0,
	 *   y: 0,
	 *   text: 'Lorem Ipsum',
	 *   fontSize: 14,
	 *   fontFamily: 'Calibri',
	 *   fill: 'green'
	 * });
	 */
	var Txt = function(config) {
		if (!_.exists(config.width)) { config.width = 'auto'; }
		if (!_.exists(config.height)) { config.height = 'auto'; }

		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.TEXT;

		// update text data for certain attr changes
		var idx = 0;
		for (; idx < _attrChangeListLength; idx += 1) {
			this.on(_attrChangeList[idx] + Constants.CHANGE_GEAR, this._setTxtData);
		}

		this._setTxtData();
	};

	Txt.extend = Util.extend;

	Util.construct(Txt.prototype, Gear.Shape.prototype, {

		draw: function(canvas) {
			var context = canvas.getContext(),
				padding = this.getPadding(),
				fontStyle = this.getFontStyle(),
				fontSize = this.getFontSize(),
				fontFamily = this.getFontFamily(),
				textHeight = this.getTextHeight(),
				lineHeightPx = this.getLineHeight() * textHeight,
				textArr = this.textArr,
				totalWidth = this.getWidth();

			canvas.save();
			
			context.font = this._getContextFont();
			context.textBaseline = 'middle';
			context.textAlign = Constants.LEFT;
			context.translate(padding, 0);
			context.translate(0, padding + textHeight / 2);

			// draw text lines
			var idx = 0, textArrLength = textArr.length;
			for (; idx < textArrLength; idx += 1) {
				var obj = textArr[idx],
					text = obj.text,
					width = obj.width;

				if (this.getAlign() === Constants.RIGHT) {
					context.translate(totalWidth - width - padding * 2, 0);
				} else if (this.getAlign() === Constants.CENTER) {
					context.translate((totalWidth - width - padding * 2) / 2, 0);
				}

				context.fillText(text, 0, 0);
				context.translate(0, lineHeightPx);
			}

			canvas.restore();
		},

		hit: function(canvas) {
			var context = canvas.getContext(),
				width = this.getWidth(),
				height = this.getHeight();

			context.beginPath();
			context.rect(0, 0, width, height);
			context.closePath();
			canvas.fillAndStroke(this);
		},
		
		getWidth: function() {
			return (this.attr.width === 'auto') ? this.getTextWidth() + this.getPadding() * 2 : this.attr.width;
		},
		
		getHeight: function() {
			return (this.attr.height === 'auto') ? (this.getTextHeight() * this.textArr.length * this.getLineHeight()) + this.getPadding() * 2 : this.attr.height;
		},
		
		getTextWidth: function() { return this.textWidth; },
		
		getTextHeight: function() { return this.textHeight; },
		
		_getTextSize: function(text) {
			_dummyContext.save();
			_dummyContext.font = this._getContextFont();

			var metrics = _dummyContext.measureText(text);
			_dummyContext.restore();

			return {
				width: metrics.width,
				height: +(this.getFontSize())
			};
		},

		_getContextFont: function() {
			return this.getFontStyle() + ' ' + _.toPx(this.getFontSize()) + ' ' + this.getFontFamily();
		},

		_addTxtLine: function(line, width, height) {
			return this.textArr.push({text: line, width: width});
		},

		_getTextWidth: function(text) {
			return _dummyContext.measureText(text).width;
		},

		_setTxtData: function() {
			var lines = this.getText().split('\n'),
				fontSize = +this.getFontSize(),
				textWidth = 0,
				lineHeightPx = this.getLineHeight() * fontSize,
				width = this.attr.width,
				height = this.attr.height,
				fixedWidth = (width !== 'auto'),
				fixedHeight = (height !== 'auto'),
				padding = this.getPadding(),
				maxWidth = (width - padding * 2),
				maxHeightPx = (height - padding * 2),
				currentHeightPx = 0,
				wrap = this.getWrap(),
				shouldWrap = (wrap !== 'none'),
				wrapAtWord = (wrap !== 'char' && shouldWrap);

			this.textArr = [];
			_dummyContext.save();
			_dummyContext.font = (this.getFontStyle() + ' ' + _.toPx(fontSize) + ' ' + this.getFontFamily());

			 var idx = 0, length = lines.length;
			 for (; idx < length; ++idx) {

				 var line = lines[idx],
					 lineWidth = this._getTextWidth(line);
				 if (fixedWidth && lineWidth > maxWidth) {
				
					// if width is fixed and line does not fit entirely
					// break the line into multiple fitting lines
					while (line.length > 0) {
						// use binary search to find the longest substring that
						// that would fit in the specified width
						 var low = 0, high = line.length,
							 match = '', matchWidth = 0;
						 while (low < high) {
							 var mid = (low + high) >>> 1,
								 substr = line.slice(0, mid + 1),
								 substrWidth = this._getTextWidth(substr);
							 if (substrWidth <= maxWidth) {
								 low = mid + 1;
								 match = substr;
								 matchWidth = substrWidth;
							 } else {
								 high = mid;
							 }
						 }

						// 'low' is now the index of the substring end
						// 'match' is the substring
						// 'matchWidth' is the substring width in px
						if (match) {
							 // a fitting substring was found
							 if (wrapAtWord) {
								 // try to find a space or dash where wrapping could be done
								 var wrapIndex = Math.max(match.lastIndexOf(' '),
														  match.lastIndexOf('-')) + 1;
								 if (wrapIndex > 0) {
									 // re-cut the substring found at the space/dash position
									 low = wrapIndex;
									 match = match.slice(0, low);
									 matchWidth = this._getTextWidth(match);
								 }
							 }

							 this._addTxtLine(match, matchWidth);
							 currentHeightPx += lineHeightPx;
							 if (!shouldWrap ||
								 (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)) {
								 /*
								  * stop wrapping if wrapping is disabled or if adding
								  * one more line would overflow the fixed height
								  */
								 break;
							 }

							 line = line.slice(low);
							 if (line.length > 0) {
								 // Check if the remaining text would fit on one line
								 lineWidth = this._getTextWidth(line);
								 if (lineWidth <= maxWidth) {
									 // if it does, add the line and break out of the loop
									 this._addTxtLine(line, lineWidth);
									 currentHeightPx += lineHeightPx;
									 break;
								 }
							 }

						 } else {
							// not even one character could fit in the element, abort
							break;
						 }
					 }
				} else {
					// element width is automatically adjusted to max line width
					this._addTxtLine(line, lineWidth);
					currentHeightPx += lineHeightPx;
					textWidth = Math.max(textWidth, lineWidth);
				}

				// if element height is fixed, abort if adding one more line would overflow
				if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
					break;
				}
			 }
			_dummyContext.restore();
			this.textHeight = fontSize;
			this.textWidth = textWidth;
		},

		toString: function() {
			return '[Text]';
		},

		getFontFamily: function() {
			var val = this.attr.fontFamily;
			return (!_.exists(val)) ? Constants.DEFAULT_FONT : val;
		},

		setFontFamily: function(val) {
			this.attr.fontFamily = val;
		},

		getFontSize: function() {
			var val = this.attr.fontSize;
			return (!_.exists(val)) ? 12 : val;
		},

		setFontSize: function(val) {
			this.attr.fontSize = val;
		},

		getFontStyle: function() {
			var val = this.attr.fontStyle;
			return (!_.exists(val)) ? 'normal' : val;
		},

		setFontStyle: function(val) {
			this.attr.fontStyle = val;
		},

		getPadding: function() {
			var val = this.attr.padding;
			return (!_.exists(val)) ? 0 : val;
		},

		setPadding: function(val) {
			this.attr.padding = val;
		},

		getAlign: function() {
			var val = this.attr.align;
			return (!_.exists(val)) ? Constants.LEFT : val;
		},

		setAlign: function(val) {
			this.attr.align = val;
		},

		getLineHeight: function() {
			var val = this.attr.lineHeight;
			return (!_.exists(val)) ? 1 : val;
		},

		setLineHeight: function(val) {
			this.attr.lineHeight = val;
		},

		getWrap: function() {
			var val = this.attr.wrap;
			return (!_.exists(val)) ? 'word' : val;
		},

		setWrap: function(val) {
			this.attr.wrap = val;
		},

		getText: function() {
			var val = this.attr.text;
			return (!_.exists(val)) ? '' : val;
		},

		setText: function(text) {
			var str = _.isString(text) ? text : text.toString();
			this.attr.text = str;
		}
	});

	Gear.Text = Txt;

}(Gear, Gear.Constants, Gear.Util));
