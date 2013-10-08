(function(Gear, Constants) {

	// TODO: Many inline functions can be abstracted out

	/**
	 * @param {Object} config
	 * @param {String} [config.fontFamily] default is Calibri
	 * @param {Number} [config.fontSize] default is 12
	 * @param {String} [config.fontStyle] can be normal, bold, or italic.  Default is normal
	 * @param {String} config.text
	 * @param {String} config.data SVG data string
	 * @example
	 * var textpath = new TextPath({
	 *   x: 100,
	 *   y: 50,
	 *   fill: '#333',
	 *   fontSize: '24',
	 *   fontFamily: 'Arial',
	 *   text: 'All the world\'s a stage, and all the men and women merely players.',
	 *   data: 'M10,10 C0,0 10,150 100,100 S300,150 400,50'
	 * });
	 */
	var TextPath = function(config) {
		this.dummyCanvas = _.element('canvas');
		this.dataArray = [];

		Gear.Shape.call(this, config);
		this._className = Constants._className.TEXT_PATH;

		this.dataArray = Gear.Path.parsePathData(this.attr.data);
		
		var self = this;
		this.on('dataChange.gear', function() {
			self.dataArray = Gear.Path.parsePathData(this.attr.data);
		});
		// update text data for certain attr changes
		this.on('textChange.gear textStroke.gear textStrokeWidth.gear', self._setTextData);
		this._setTextData();
	};

	_.extend(TextPath.prototype, Gear.Shape.prototype, {
		fill: function(context) {
			context.fillText(this.partialText, 0, 0);
		},

		stroke: function(context) {
			context.strokeText(this.partialText, 0, 0);
		},

		draw: function(canvas) {
			var charArr = this.charArr, context = canvas.getContext();

			context.font = this._getContextFont();
			context.textBaseline = 'middle';
			context.textAlign = 'left';
			context.save();

			var glyphInfo = this.glyphInfo;
			for (var i = 0; i < glyphInfo.length; i += 1) {
				context.save();

				var p0 = glyphInfo[i].p0;
				var p1 = glyphInfo[i].p1;
				var ht = parseFloat(this.attr.fontSize);

				context.translate(p0.x, p0.y);
				context.rotate(glyphInfo[i].rotation);
				this.partialText = glyphInfo[i].text;

				canvas.fillAndStroke(this);
				context.restore();

				//// To assist with debugging visually, uncomment following
				// context.beginPath();
				// if (i % 2)
				// context.strokeStyle = 'cyan';
				// else
				// context.strokeStyle = 'green';

				// context.moveTo(p0.x, p0.y);
				// context.lineTo(p1.x, p1.y);
				// context.stroke();
			}
			context.restore();
		},

		getTextWidth: function() {
			return this.textWidth;
		},
		
		getTextHeight: function() {
			return this.textHeight;
		},
		
		setText: function(text) {
			Gear.Text.prototype.setText.call(this, text);
		},

		_getTextSize: function(text) {
			var dummyCanvas = this.dummyCanvas;
			var context = dummyCanvas.getContext(Constants.CONTEXT_2D);

			context.save();

			context.font = this._getContextFont();
			var metrics = context.measureText(text);

			context.restore();

			return {
				width: metrics.width,
				height: _.parseInt(this.attr.fontSize)
			};
		},
		_setTextData: function() {
			var self = this,
				size = this._getTextSize(this.attr.text);
			this.textWidth = size.width;
			this.textHeight = size.height;

			this.glyphInfo = [];

			var charArr = this.attr.text.split('');

			var p0, p1, pathCmd;

			var pIndex = -1;
			var currentT = 0;

			var getNextPathSegment = function() {
				currentT = 0;
				var pathData = self.dataArray;

				for (var i = pIndex + 1; i < pathData.length; i += 1) {
					if (pathData[i].pathLength > 0) {
						pIndex = i;

						return pathData[i];
					} else if (pathData[i].command === 'M') {
						p0 = {
							x: pathData[i].points[0],
							y: pathData[i].points[1]
						};
					}
				}

				return {};
			};

			var findSegmentToFitCharacter = function(c, before) {

				var glyphWidth = self._getTextSize(c).width;

				var currLen = 0;
				var attempts = 0;
				var needNextSegment = false;
				p1 = null;
				while (Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 && attempts < 25) {
					attempts++;
					var cumulativePathLength = currLen;
					while (!_.exists(pathCmd)) {
						pathCmd = getNextPathSegment();

						if (pathCmd && cumulativePathLength + pathCmd.pathLength < glyphWidth) {
							cumulativePathLength += pathCmd.pathLength;
							pathCmd = null;
						}
					}

					if (pathCmd === {} || !_.exists(p0)) {
						return;
					}

					var needNewSegment = false;

					switch (pathCmd.command) {
						case 'L':
							if (Gear.Path.getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) > glyphWidth) {
								p1 = Gear.Path.getPointOnLine(glyphWidth, p0.x, p0.y, pathCmd.points[0], pathCmd.points[1], p0.x, p0.y);
							} else {
								pathCmd = null;
							}
							break;
						case 'A':

							var start = pathCmd.points[4];
							// 4 = theta
							var dTheta = pathCmd.points[5];
							// 5 = dTheta
							var end = pathCmd.points[4] + dTheta;

							if (currentT === 0) {
								currentT = start + Gear.Math.MICRO_FLOAT;
							} else if (glyphWidth > currLen) {
								currentT += (Math.PI / 180.0) * dTheta / Math.abs(dTheta);
							} else {
								currentT -= Math.PI / 360.0 * dTheta / Math.abs(dTheta);
							}

							// Credit for bug fix: @therth https://github.com/ericdrowell/Gear/issues/249
							if (dTheta < 0 && currentT < end || dTheta >= 0 && currentT > end) {
								currentT = end;
								needNewSegment = true;
							}
							p1 = Gear.Path.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
							break;
						case 'C':
							if (currentT === 0) {
								if (glyphWidth > pathCmd.pathLength) {
									currentT = Gear.Math.MICRO_FLOAT;
								} else {
									currentT = glyphWidth / pathCmd.pathLength;
								}
							} else if (glyphWidth > currLen) {
								currentT += (glyphWidth - currLen) / pathCmd.pathLength;
							} else {
								currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
							}

							if (currentT > 1.0) {
								currentT = 1.0;
								needNewSegment = true;
							}
							p1 = Gear.Path.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
							break;
						case 'Q':
							if (currentT === 0) {
								currentT = glyphWidth / pathCmd.pathLength;
							} else if (glyphWidth > currLen) {
								currentT += (glyphWidth - currLen) / pathCmd.pathLength;
							} else {                                
								currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
							}

							if (currentT > 1.0) {
								currentT = 1.0;
								needNewSegment = true;
							}
							p1 = Gear.Path.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
							break;

					}

					if (_.exists(p1)) {
						currLen = Gear.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
					}

					if (needNewSegment) {
						needNewSegment = false;
						pathCmd = null;
					}
				}
			};
			for (var i = 0; i < charArr.length; i += 1) {

				// Find p1 such that line segment between p0 and p1 is approx. width of glyph
				findSegmentToFitCharacter(charArr[i]);

				if (!_.exists(p0) || !_.exists(p1)) {
					break;
				}

				var width = Gear.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);

				// Note: Since glyphs are rendered one at a time, any kerning pair data built into the font will not be used.
				// Can foresee having a rough pair table built in that the developer can override as needed.

				var kern = 0;
				// placeholder for future implementation

				var midpoint = Gear.Path.getPointOnLine(kern + width / 2.0, p0.x, p0.y, p1.x, p1.y);

				var rotation = Math.atan2((p1.y - p0.y), (p1.x - p0.x));
				this.glyphInfo.push({
					transposeX: midpoint.x,
					transposeY: midpoint.y,
					text: charArr[i],
					rotation: rotation,
					p0: p0,
					p1: p1
				});
				p0 = p1;
			}
		},

		getText: function() {
			var val = this.attr.text;
			return (!_.exists(val)) ? '' : val;
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
		}
	});

	// map TextPath methods to Text
	TextPath.prototype._getContextFont = Gear.Text.prototype._getContextFont;

	Gear.TextPath = TextPath;

}(Gear, Gear.Constants));
