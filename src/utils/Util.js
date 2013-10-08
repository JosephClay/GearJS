(function(Gear, Constants, Global) {

	var Util = {
		// Helper function to correctly set up the prototype chain, for subclasses.
		// Similar to `goog.inherits`, but uses a hash of prototype properties and
		// class properties to be extended.
		extend: function(protoProps, staticProps) {
			var parent = this,
				child = function() {
					return parent.apply(this, arguments);
				};

			// Add static properties to the constructor function, if supplied.
			_.extend(child, parent, staticProps);

			// Set the prototype chain to inherit from `parent`, without calling
			// `parent`'s constructor function.
			var Surrogate = function() { this.constructor = child; };
			Surrogate.prototype = parent.prototype;
			child.prototype = new Surrogate();

			// Add prototype properties (instance properties) to the subclass, if supplied
			if (protoProps) {
				_.extend(child.prototype, protoProps);
			}

			// Set a convenience property in case the parent's prototype is needed later
			child.__super__ = parent.prototype;

			return child;
		},

		// arg can be an image object or image data
		getImage: function(arg, callback) {
			var imageObj, canvas, context, dataUrl;

			if (!_.exists(arg)) {
				// if arg is null or undefined
				callback(null);
			} else if (_.isElement(arg)) {
				// if arg is already an image object
				callback(arg);
			} else if (_.isString(arg)) {
				// if arg is a string, then it's a data url
				imageObj = new Image();
				imageObj.onload = function() {
					callback(imageObj);
				};
				imageObj.src = arg;
			} else if (arg && arg.data) {
				// if arg is an object that contains the data property, it's an image object
				canvas = _.element(Constants.CANVAS);
				canvas.width = arg.width;
				canvas.height = arg.height;
				context = canvas.getContext(Constants.CONTEXT_2D);
				context.putImageData(arg, 0, 0);
				dataUrl = canvas.toDataURL();
				imageObj = new Image();
				imageObj.onload = function() {
					callback(imageObj);
				};
				imageObj.src = dataUrl;
			} else {
				callback(null);
			}
		},
		
		getControlPoints: function(previousPoint, point, nextPoint, tension) {
			var x0 = previousPoint.x,
				y0 = previousPoint.y,
				x1 = point.x,
				y1 = point.y,
				x2 = nextPoint.x,
				y2 = nextPoint.y,
				d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)),
				d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
				fa = tension * d01 / (d01 + d12),
				fb = tension * d12 / (d01 + d12),
				p1x = x1 - fa * (x2 - x0),
				p1y = y1 - fa * (y2 - y0),
				p2x = x1 + fb * (x2 - x0),
				p2y = y1 + fb * (y2 - y0);

			return [
				{
					x: p1x,
					y: p1y
				},
				{
					x: p2x,
					y: p2y
				}
			];
		},

		expandPoints: function(points, tension) {
			var allPoints = [],
				idx = 1, length = points.length - 1,
				controlPoint;

			for (; idx < length; idx += 1) {
				controlPoint = Util.getControlPoints(points[idx - 1], points[idx], points[idx + 1], tension);
				allPoints.push(controlPoint[0]);
				allPoints.push(points[idx]);
				allPoints.push(controlPoint[1]);
			}

			return allPoints;
		}
	};

	Gear.Util = Util;

}(Gear, Gear.Constants, Gear.Global));