(function(Gear, Constants) {

	// TODO: Optimize - lots of room for it

	/**
	 * @param {Object} config
	 * @param {String} config.data SVG data string
	 * @example
	 * var path = new Path({
	 *   x: 240,
	 *   y: 40,
	 *   data: 'M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z',
	 *   fill: 'green',
	 *   scale: 2
	 * });
	 */
	var Path = function(config) {
		this.dataArray = [];

		Gear.Shape.call(this, config);
		this._className = Constants.CLASS.PATH;

		this.dataArray = Path.parsePathData(this.getData());
		
		var self = this;
		this.on('dataChange.gear', function() {
			self.dataArray = Path.parsePathData(this.getData());
		});
	};

	_.extend(Path.prototype, Gear.Shape.prototype, {
		
		draw: function(canvas) {
			var data = this.dataArray,
				context = canvas.getContext();

			context.beginPath();
			
			var idx = 0, length = data.length,
				command, points;
			for (; idx < length; idx += 1) {
				
				command = data[idx].command;
				points = data[idx].points;

				switch (command) {
					case 'L':
						context.lineTo(points[0], points[1]);
						break;
					case 'M':
						context.moveTo(points[0], points[1]);
						break;
					case 'C':
						context.bezierCurveTo(points[0], points[1], points[2], points[3], points[4], points[5]);
						break;
					case 'Q':
						context.quadraticCurveTo(points[0], points[1], points[2], points[3]);
						break;
					case 'A':
						var cx = points[0],
							cy = points[1],
							rx = points[2],
							ry = points[3],
							theta = points[4],
							dTheta = points[5],
							psi = points[6],
							fs = points[7],
							r = (rx > ry) ? rx : ry,
							scaleX = (rx > ry) ? 1 : rx / ry,
							scaleY = (rx > ry) ? ry / rx : 1;

						context.translate(cx, cy);
						context.rotate(psi);
						context.scale(scaleX, scaleY);
						context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
						context.scale(1 / scaleX, 1 / scaleY);
						context.rotate(-psi);
						context.translate(-cx, -cy);

						break;
					case 'z':
						context.closePath();
						break;
				}
			}

			if (_.exists(this.getFill())) {
				canvas.fill(this);
			}
				
			canvas.stroke(this);
		}
	});


	// Helpers
	var _cb1 = function(t) {
			return t * t * t;
		},
		_cb2 = function(t) {
			return 3 * t * t * (1 - t);
		},
		_cb3 = function(t) {
			return 3 * t * (1 - t) * (1 - t);
		},
		_cb4 = function(t) {
			return (1 - t) * (1 - t) * (1 - t);
		},
		//
		_qb1 = function(t) {
			return t * t;
		},
		_qb2 = function(t) {
			return 2 * t * (1 - t);
		},
		_qb3 = function(t) {
			return (1 - t) * (1 - t);
		},
		//
		_vMag = function(v) {
			return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
		},
		_vRatio = function(u, v) {
			return (u[0] * v[0] + u[1] * v[1]) / (_vMag(u) * _vMag(v));
		},
		_vAngle = function(u, v) {
			return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(_vRatio(u, v));
		};

	// Path            
	_.extend(Path, {

		getLineLength: function(x1, y1, x2, y2) {
			return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
		},

		getPointOnLine: function(dist, P1x, P1y, P2x, P2y, fromX, fromY) {
			if (!_.exists(fromX)) { fromX = P1x; }
			if (!_.exists(fromY)) { fromY = P1y; }

			var m = (P2y - P1y) / ((P2x - P1x) + Gear.Math.MICRO_FLOAT),
				run = Math.sqrt(dist * dist / (1 + m * m));
			
			if (P2x < P1x) { run *= -1; }

			var rise = m * run,
				pt;

			if ((fromY - P1y) / ((fromX - P1x) + Gear.Math.MICRO_FLOAT) === m) {
				pt = {
					x: fromX + run,
					y: fromY + rise
				};
			} else {
				var ix, iy;

				var len = this.getLineLength(P1x, P1y, P2x, P2y);
				if (len < Gear.Math.MICRO_FLOAT) { return; }

				var u = (((fromX - P1x) * (P2x - P1x)) + ((fromY - P1y) * (P2y - P1y)));
				u = u / (len * len);
				ix = P1x + u * (P2x - P1x);
				iy = P1y + u * (P2y - P1y);

				var pRise = this.getLineLength(fromX, fromY, ix, iy),
					pRun = Math.sqrt(dist * dist - pRise * pRise);
				run = Math.sqrt(pRun * pRun / (1 + m * m));
				if (P2x < P1x) {
					run *= -1;
				}
				rise = m * run;
				pt = {
					x: ix + run,
					y: iy + rise
				};
			}

			return pt;
		},

		getPointOnCubicBezier: function(pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
			return {
				x: P4x * _cb1(pct) + P3x * _cb2(pct) + P2x * _cb3(pct) + P1x * _cb4(pct),
				y: P4y * _cb1(pct) + P3y * _cb2(pct) + P2y * _cb3(pct) + P1y * _cb4(pct)
			};
		},
		
		getPointOnQuadraticBezier: function(pct, P1x, P1y, P2x, P2y, P3x, P3y) {
			return {
				x: P3x * _qb1(pct) + P2x * _qb2(pct) + P1x * _qb3(pct),
				y: P3y * _qb1(pct) + P2y * _qb2(pct) + P1y * _qb3(pct)
			};
		},
		
		getPointOnEllipticalArc: function(cx, cy, rx, ry, theta, psi) {
			var cosPsi = Math.cos(psi), sinPsi = Math.sin(psi),
				pt = {
					x: rx * Math.cos(theta),
					y: ry * Math.sin(theta)
				};
			return {
				x: cx + (pt.x * cosPsi - pt.y * sinPsi),
				y: cy + (pt.x * sinPsi + pt.y * cosPsi)
			};
		},

		// get parsed data array from the data
		// string.  V, v, H, h, and l data are converted to
		// L data for the purpose of high performance Path
		// rendering
		parsePathData: function(data) {
			// Path Data Segment must begin with a moveTo
			// m (x y)+  Relative moveTo (subsequent points are treated as lineTo)
			// M (x y)+  Absolute moveTo (subsequent points are treated as lineTo)
			// l (x y)+  Relative lineTo
			// L (x y)+  Absolute LineTo
			// h (x)+    Relative horizontal lineTo
			// H (x)+    Absolute horizontal lineTo
			// v (y)+    Relative vertical lineTo
			// V (y)+    Absolute vertical lineTo
			// z (closepath)
			// Z (closepath)
			// c (x1 y1 x2 y2 x y)+ Relative Bezier curve
			// C (x1 y1 x2 y2 x y)+ Absolute Bezier curve
			// q (x1 y1 x y)+       Relative Quadratic Bezier
			// Q (x1 y1 x y)+       Absolute Quadratic Bezier
			// t (x y)+    Shorthand/Smooth Relative Quadratic Bezier
			// T (x y)+    Shorthand/Smooth Absolute Quadratic Bezier
			// s (x2 y2 x y)+       Shorthand/Smooth Relative Bezier curve
			// S (x2 y2 x y)+       Shorthand/Smooth Absolute Bezier curve
			// a (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+     Relative Elliptical Arc
			// A (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+  Absolute Elliptical Arc

			// return early if data is not defined
			if (!data) { return []; }

			// command string
			var cs = data;

			// command chars
			var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
			// convert white spaces to commas
			cs = cs.replace(Constants.REGEX.SPACE, ',');
			// create pipes so that we can split the data
			var idx =  0, length = cc.length;
			for (; idx < length; idx += 1) {
				cs = cs.replace(new RegExp(cc[idx], 'g'), '|' + cc[idx]);
			}
			// create array
			var arr = cs.split('|');
			var ca = [];
			// init context point
			var cpx = 0;
			var cpy = 0;
			idx = 1; length = arr.length;
			for (; idx < length; idx += 1) {
				var str = arr[idx];
				var c = str.charAt(0);
				str = str.slice(1);
				// remove ,- for consistency
				str = str.replace(Constants.REGEX.COMMA_DASH, '-');
				// add commas so that it's easy to split
				str = str.replace(Constants.REGEX.DASH, ',-');
				str = str.replace(Constants.REGEX.E_DASH, 'e-');
				var p = str.split(',');
				if (p.length > 0 && p[0] === '') {
					p.shift();
				}
				// convert strings to floats
				for (var i = 0; i < p.length; i += 1) {
					p[i] = parseFloat(p[i]);
				}

				while (p.length > 0) {
					if (isNaN(p[0])) { break; } // case for a trailing comma before next command

					var cmd = null,
						points = [],
						startX = cpx, startY = cpy,
						// Move var from within the switch to up here (jshint)
						prevCmd, ctlPtx, ctlPty, // Ss, Tt
						rx, ry, psi, fa, fs, x1, y1; // Aa

					// convert l, H, h, V, and v to L
					switch (c) {

						// Note: Keep the lineTo's above the moveTo's in this switch
						case 'l':
							cpx += p.shift();
							cpy += p.shift();
							cmd = 'L';
							points.push(cpx, cpy);
							break;
						case 'L':
							cpx = p.shift();
							cpy = p.shift();
							points.push(cpx, cpy);
							break;

						// Note: lineTo handlers need to be above this point
						case 'm':
							cpx += p.shift();
							cpy += p.shift();
							cmd = 'M';
							points.push(cpx, cpy);
							c = 'l';
							// subsequent points are treated as relative lineTo
							break;
						case 'M':
							cpx = p.shift();
							cpy = p.shift();
							cmd = 'M';
							points.push(cpx, cpy);
							c = 'L';
							// subsequent points are treated as absolute lineTo
							break;

						case 'h':
							cpx += p.shift();
							cmd = 'L';
							points.push(cpx, cpy);
							break;
						case 'H':
							cpx = p.shift();
							cmd = 'L';
							points.push(cpx, cpy);
							break;
						case 'v':
							cpy += p.shift();
							cmd = 'L';
							points.push(cpx, cpy);
							break;
						case 'V':
							cpy = p.shift();
							cmd = 'L';
							points.push(cpx, cpy);
							break;
						case 'C':
							points.push(p.shift(), p.shift(), p.shift(), p.shift());
							cpx = p.shift();
							cpy = p.shift();
							points.push(cpx, cpy);
							break;
						case 'c':
							points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
							cpx += p.shift();
							cpy += p.shift();
							cmd = 'C';
							points.push(cpx, cpy);
							break;
						case 'S':
							ctlPtx = cpx; ctlPty = cpy;
							prevCmd = ca[ca.length - 1];
							if (prevCmd.command === 'C') {
								ctlPtx = cpx + (cpx - prevCmd.points[2]);
								ctlPty = cpy + (cpy - prevCmd.points[3]);
							}
							points.push(ctlPtx, ctlPty, p.shift(), p.shift());
							cpx = p.shift();
							cpy = p.shift();
							cmd = 'C';
							points.push(cpx, cpy);
							break;
						case 's':
							ctlPtx = cpx; ctlPty = cpy;
							prevCmd = ca[ca.length - 1];
							if (prevCmd.command === 'C') {
								ctlPtx = cpx + (cpx - prevCmd.points[2]);
								ctlPty = cpy + (cpy - prevCmd.points[3]);
							}
							points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
							cpx += p.shift();
							cpy += p.shift();
							cmd = 'C';
							points.push(cpx, cpy);
							break;
						case 'Q':
							points.push(p.shift(), p.shift());
							cpx = p.shift();
							cpy = p.shift();
							points.push(cpx, cpy);
							break;
						case 'q':
							points.push(cpx + p.shift(), cpy + p.shift());
							cpx += p.shift();
							cpy += p.shift();
							cmd = 'Q';
							points.push(cpx, cpy);
							break;
						case 'T':
							ctlPtx = cpx; ctlPty = cpy;
							prevCmd = ca[ca.length - 1];
							if (prevCmd.command === 'Q') {
								ctlPtx = cpx + (cpx - prevCmd.points[0]);
								ctlPty = cpy + (cpy - prevCmd.points[1]);
							}
							cpx = p.shift();
							cpy = p.shift();
							cmd = 'Q';
							points.push(ctlPtx, ctlPty, cpx, cpy);
							break;
						case 't':
							ctlPtx = cpx; ctlPty = cpy;
							prevCmd = ca[ca.length - 1];
							if (prevCmd.command === 'Q') {
								ctlPtx = cpx + (cpx - prevCmd.points[0]);
								ctlPty = cpy + (cpy - prevCmd.points[1]);
							}
							cpx += p.shift();
							cpy += p.shift();
							cmd = 'Q';
							points.push(ctlPtx, ctlPty, cpx, cpy);
							break;
						case 'A':
							rx = p.shift(); ry = p.shift(); psi = p.shift(); fa = p.shift(); fs = p.shift();
							x1 = cpx; y1 = cpy; cpx = p.shift(); cpy = p.shift();
							cmd = 'A';
							points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
							break;
						case 'a':
							rx = p.shift(); ry = p.shift(); psi = p.shift(); fa = p.shift(); fs = p.shift();
							x1 = cpx; y1 = cpy; cpx += p.shift(); cpy += p.shift();
							cmd = 'A';
							points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
							break;
					}

					ca.push({
						command: cmd || c,
						points: points,
						start: {
							x: startX,
							y: startY
						},
						pathLength: this.calcLength(startX, startY, cmd || c, points)
					});
				}

				if (c === 'z' || c === 'Z') {
					ca.push({
						command: 'z',
						points: [],
						start: undefined,
						pathLength: 0
					});
				}
			}

			return ca;
		},

		calcLength: function(x, y, cmd, points) {
			var self = this,
				t, length, p1, p2;

			switch (cmd) {
				case 'L':
					return self.getLineLength(x, y, points[0], points[1]);
				case 'C':
					// Approximates by breaking curve into 100 line segments
					length = 0.0;
					p1 = self.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
					for (t = 0.01; t <= 1; t += 0.01) {
						p2 = self.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
						length += self.getLineLength(p1.x, p1.y, p2.x, p2.y);
						p1 = p2;
					}
					return length;
				case 'Q':
					// Approximates by breaking curve into 100 line segments
					length = 0.0;
					p1 = self.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
					for (t = 0.01; t <= 1; t += 0.01) {
						p2 = self.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
						length += self.getLineLength(p1.x, p1.y, p2.x, p2.y);
						p1 = p2;
					}
					return length;
				case 'A':
					// Approximates by breaking curve into line segments
					length = 0.0;

					var start = points[4], // 4 = theta
						dTheta = points[5], // 5 = dTheta
						end = points[4] + dTheta,
						inc = Math.PI / 180.0;

					// 1 degree resolution
					if (Math.abs(start - end) < inc) {
						inc = Math.abs(start - end);
					}
					// Note: for purpose of calculating arc length, not going to worry about rotating X-axis by angle psi
					p1 = self.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
					if (dTheta < 0) {// clockwise
						for (t = start - inc; t > end; t -= inc) {
							p2 = self.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
							length += self.getLineLength(p1.x, p1.y, p2.x, p2.y);
							p1 = p2;
						}
					} else {// counter-clockwise
						for (t = start + inc; t < end; t += inc) {
							p2 = self.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
							length += self.getLineLength(p1.x, p1.y, p2.x, p2.y);
							p1 = p2;
						}
					}
					p2 = self.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
					length += self.getLineLength(p1.x, p1.y, p2.x, p2.y);

					return length;
			}

			return 0;
		},

		// Derived from: http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
		convertEndpointToCenterParameterization: function(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
			var psi = (psiDeg * (Math.PI / 180.0)),
				xp = (Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0),
				yp = (-1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0),
				lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

			if (lambda > 1) {
				rx *= Math.sqrt(lambda);
				ry *= Math.sqrt(lambda);
			}

			var f = Math.sqrt((((rx * rx) * (ry * ry)) - ((rx * rx) * (yp * yp)) - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp) + (ry * ry) * (xp * xp)));

			if (fa === fs) { f *= -1; }

			if (isNaN(f)) { f = 0; }

			var cxp = f * rx * yp / ry,
				cyp = f * -ry * xp / rx,
				//
				cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp,
				cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp,
				//
				theta = _vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]),
				u = [(xp - cxp) / rx, (yp - cyp) / ry],
				v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry],
				dTheta = _vAngle(u, v);

			if (_vRatio(u, v) <= -1) { dTheta = Math.PI; }

			if (_vRatio(u, v) >= 1) { dTheta = 0; }

			if (fs === 0 && dTheta > 0) { dTheta = (dTheta - 2 * Math.PI); }

			if (fs === 1 && dTheta < 0) { dTheta = (dTheta + 2 * Math.PI); }

			return [cx, cy, rx, ry, theta, dTheta, psi, fs];
		},

		getData: function() {
			return this.attr.data;
		},
		setData: function(val) {
			this.attr.data = val;
		}
	});

	Gear.Path = Path;

}(Gear, Gear.Constants));
