/**
 * Xaja.js 0.0.1
 * https://github.com/JosephClay/Xaja
 */
var Xaja = (function(win) {
    
    var _getXHR = function() { // Get XMLHttpRequest object
            return win.XMLHttpRequest ?
                   new XMLHttpRequest() :
                   new ActiveXObject('Microsoft.XMLHTTP');
        },
        _isVersion2 = (_getXHR().responseType === ''), // Determine XHR version
        _queryRegex = /\?/, // cached regex for Request
        _accepts = { // Accept header types
            xml: 'application/xml, text/xml',
            html: 'text/html',
            text: 'text/plain',
            json: 'application/json, text/javascript',
            js: 'application/javascript, text/javascript'
        },
        // Get these from the window or IE
        // will throw an "undefined" error
        _JSON = win.JSON,
        _ArrayBuffer = win.ArrayBuffer,
        _Blob = win.Blob,
        _Document = win.Document,
        _FormData = win.FormData;

    var Promise = function(xhr) {
        this.xhr = xhr;
        this.events = {
            success: [],
            error: [],
            progress: [],
            complete: []
        };
    };
    Promise.prototype = {
        success: function(func) {
            this.events.success.push(func);
            return this;
        },
        done: function(func) { return this.success(func); },

        error: function(func) {
            this.events.error.push(func);
            return this;
        },
        fail: function(func) { return this.error(func); },

        progress: function(func) {
            this.events.progress.push(func);
            return this;
        },

        complete: function(func) {
            this.events.complete.push(func);
            return this;
        },
        always: function(func) { return this.complete(func); },

        abort: function() {
            this.xhr.abort();
        },

        trigger: function(type, args) {
            var arr = this.events[type],
                idx = 0, length = arr.length; 
            for (; idx < length; idx++) {
                arr[idx].apply(this.xhr, args || []);
            }

            this.events[type] = [];

            return this;
        }
    };

    var _handleResponse = function(xhr, url, isTypeSupported, type, promises) {
        var response,
            parseError = 'parseError',
            responseText = 'responseText',
            responseXML = 'responseXML';

        try {
            if (xhr.status !== 200) { // Verify status code
                throw new Error(xhr.status +' ('+ xhr.statusText +')');
            }

            // Process response
            if (type === 'text' || type === 'html') {

                response = xhr[responseText];

            } else if (isTypeSupported && xhr.response !== undefined) {

                response = xhr.response;

            } else {
                if (type === 'json') {

                    try {
                        response = _JSON ? _JSON.parse(xhr[responseText]) : eval('(' + xhr[responseText] + ')');
                    } catch(e) {
                        throw new Error('Error while parsing JSON body');
                    }

                } else if (type === 'js') {

                    response = eval(xhr[responseText]);

                } else if (type === 'xml') {

                    if (!xhr[responseXML] ||
                        (xhr[responseXML][parseError] && xhr[responseXML][parseError].errorCode && xhr[responseXML][parseError].reason)) {
                        throw new Error('Error while parsing XML body');
                    } else {
                        response = xhr[responseXML];
                    }

                } else {
                    throw new Error('Unsupported '+ type +' type');
                }
            }

            promises.trigger('success', [xhr, url, response]);

        } catch(e) {

            response = ('Request to "'+ url +'" errored: ' + e);
            promises.trigger('error', [xhr, url, response]);

        }

        // Execute complete stack
        promises.trigger('complete', [xhr, url, response]);
    };

    var _isSupportedType = function(xhr, type) {
        // Identify supported XHR version
        var isSupported = false;
        if (type && _isVersion2) {
            try {
                xhr.responseType = type;
                isSupported = (xhr.responseType === type);
            } catch(e) {}
        }
        return isSupported;
    };

    var _prepData = function(data, vars, isGet) {
        // Prepare data
        if (_ArrayBuffer && data instanceof _ArrayBuffer ||
            _Blob && data instanceof _Blob ||
            _Document && data instanceof _Document ||
            _FormData && data instanceof _FormData) {
            if (isGet) {
                // Cannot send any of the above types
                // in a GET request. Throw out the data
                data = null;
            }
        } else {
            var values = [],
                key;
            for (key in data) {
                values.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
            data = values.join('&');
        }

        if (isGet) { vars += data; }

        return data;
    };

    var _cacheBust = function(str, cache) {
        var allowCache = !!cache;
        if (!allowCache) {
            if (str) { str += '&'; }
            str += ('_='+ Date.now());
        }
    };

    var _bindProgress = function(xhr, promises) {
        if (!_isVersion2) { return; }

        var fire = function() {
            promises.trigger('progress', arguments);
        };

        xhr.addEventListener('progress', fire, false);
        if (xhr.upload) {  xhr.upload.addEventListener('progress', fire, false); }
    };


    var _createRequest = function(method, url, opts) {
        if (typeof url === 'object' && !opts) {
            opts = url;
            url = opts.url;
        }

        var promise = new Request(method, url, opts);

        if (!opts) { return promise; }

        // Add the methods to the promise if they exist
        // on the options
        if (opts.error) { promise.error(opts.error); }
        if (opts.success) { promise.success(opts.success); }
        if (opts.progress) { promise.progress(opts.progress); }
        if (opts.complete) { promise.complete(opts.complete); }

        return promise;
    };

    var Request = function(method, url, opts) {
        opts = opts || {};
        url = url || '';

        var xhr = _getXHR(),
            dataObj = opts.dataObj || null,
            isGet = (method === 'GET'),
            isPost = !isGet,
            isAsync = (opts.async === undefined) ? true : !!opts.async,
            type = (opts.type) ? opts.type.toLowerCase() : (opts.dataType) ? opts.dataType.toLowerCase() : 'text',
            isTypeSupported = _isSupportedType(xhr, type),
            headers = {
                'X-Requested-With': 'XMLHttpRequest'
            },
            queryString = '',
            data = _prepData(dataObj, queryString, isGet),
            isSerialized = (typeof data === 'string'),
            promise = new Promise(xhr);

        // Cache bust the query string
        _cacheBust(queryString, opts.cache);

        if (queryString) {
            // Check if url has ? to append the queryString to the url
            url += (_queryRegex.test(url) ? '&' : '?') + queryString;
        }

        _bindProgress(xhr, promise);
        
        // Open connection
        xhr.open(method, url, isAsync, opts.user || '', opts.password || '');

        // Plug response handler
        if (_isVersion2) {
            xhr.onload = function() {
                _handleResponse(xhr, url, isTypeSupported, type, promise);
            };
        } else {
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    _handleResponse(xhr, url, isTypeSupported, type, promise);
                }
            };
        }

        // Prepare headers
        if (isSerialized && isPost) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        headers.Accept = _accepts[type];

        var key;
        for (key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

        // Send
        xhr.send(isPost ? data : null);
        
        // Timeout
        if (opts.timeout) {
            this.loadTimeout = setTimeout(function() {
                xhr.abort();
                console.log('Loading timed out for: '+ url +' timeout: '+ opts.timeout);
            }, opts.timeout);
        }

        return promise;
    };

    // Return public methods
    return {
        // Can call via Xaja.get('', {}); or
        // Xaja.get({}) where the url is a prop in the object
        get: function(url, opts) {
            return _createRequest('GET', url, opts);
        },
        post: function(url, opts) {
            return _createRequest('POST', url, opts);
        }
    };
    
}(window));