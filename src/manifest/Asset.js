(function(Gear, Constants) {

		// Time in milliseconds to assume a load has failed.
	var LOAD_TIMEOUT = 8000,
		// The preload type for css files. CSS files are loaded into a LINK or STYLE tag (depending on the load type)
		CSS = 'css',
		// The preload type for image files, usually png, gif, or jpg/jpeg. Images are loaded into an IMAGE tag.
		IMAGE = 'image',
		// The preload type for javascript files, usually with the 'js' file extension. JavaScript files are loaded into a SCRIPT tag.
		JAVASCRIPT = 'javascript',
		// The preload type for json files, usually with the 'json' file extension. JSON data is loaded and parsed into a 
		JSON = 'json',
		// The preload type for sound files, usually mp3, ogg, or wav. Audio is loaded into an AUDIO tag.
		SOUND = 'sound',
		// The preload type for SVG files.
		SVG = 'svg',
		// The preload type for text files, which is also the default file type if the type can not be determined. Text is loaded as raw text.
		// TEXT = 'text', // Note that this is used elsewhere and is already defined
		// The preload type for xml files. XML is loaded into an XML document.
		XML = 'xml';

	var Asset = function(value) {
		value = value || {};
		
		this.id = (!_.exists(value.id) || value.id === '') ? value.src : value.id;
		this.src = value.src;

		var match = this._parseURI(value.src);
		this.ext = (_.exists(match)) ? match[5] : null;
		this.type = (!_.exists(value.type)) ? this._getTypeByExtension(this.ext) : value.type;
		
		// How far this load has progressed
		this.progress = 0;
	};

	Asset.prototype = {

		getTag: function(type) {
			return this._tag || (this.tag = (function() {
					switch (this.type) {
						case IMAGE:
							return _.element('img');
						case SOUND:
							return _.element('audio', { autoplay: false });
						case JAVASCRIPT:
							return _.element('script', { type: 'text/javascript' });
						case CSS:
							return _.element('link', { rel: 'stylesheet', type: 'text/css' });
						case SVG:
							return _.element('svg', { type: 'image/svg+xml' });
					}
					return null;
				}())
			);
		},

		_parseURI: function(path) {
			if (!path) { return null; }
			return path.match(Constants.REGEX.FILE_PATTERN);
		},

		// Determine the type of the object using common extensions. Note that the type can be passed in with the load item if it is an unusual extension.
		_getTypeByExtension: function(extension) {
			switch (extension.toLowerCase()) {
				case 'bmp':
					return IMAGE;
				case 'jpeg':
					return IMAGE;
				case 'jpg':
					return IMAGE;
				case 'gif':
					return IMAGE;
				case 'png':
					return IMAGE;
				case 'wav':
					return SOUND;
				case 'json':
					return JSON;
				case 'xml':
					return XML;
				case 'css':
					return CSS;
				case 'js':
					return JAVASCRIPT;
				case 'svg':
					return SVG;
				// case 'webp':
				// case 'ogg':
				// case 'mp3':
				default:
					return TEXT;
			}
		},

		load: function(callback) {
			if (this.type === IMAGE) {
				this.imageLoad(callback);
				return;
			}

			this.xhrLoad(callback);
		},

		imageLoad: function(callback) {
			var img = new Image();
			img.onload = function() {
				this.result = img;
				if (callback) { callback.call(); }
			}.bind(this);
			img.src = this.src;
		},

		xhrLoad: function(callback) {
			var self = this;
			Gear.Xaja.get({
				url: this.src,
				dataType: this.type,
				timeout: LOAD_TIMEOUT,
				success: function(result) {
					self.result = result;
				},
				error: function() {
					throw new Error('Error loading id: ' + self.id + ' src: ' + self.src);
				},
				progress: function(e) {
					// make sure we can compute the length
					if (e.lengthComputable) {
						// calculate the percentage loaded
						var percent = (e.loaded / e.total) * 100;
						self.progress = percent;
						return;
					}

					// this usually happens when Content-Length isn't set
					console.warn('Content-Length not reported!');
				},
				complete: function() {
					if (callback) { callback.call(); }
				}
			});
		},

		toString: function() {
			return '[Manifest Asset]';
		}
	};

	Gear.Asset = Asset;

}(Gear, Gear.Const));