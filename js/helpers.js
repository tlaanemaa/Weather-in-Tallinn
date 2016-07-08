// Helper functions wrapped in a "module"
var h = (function(){
	'use strict';
	var JSONPcount, out, getJSONPuid;
	out = {};

	// Small wrapper function to handle XMLHttp get requests for JSON APIs
	// Callback should accept two inputs, err and data (function(err, data){...})
	// This uses jsonp.afeld.me proxy to get around same origin policy
	out.getJSON = function(url, callback, proxy) {
		if(proxy === undefined) proxy = true; // Set default value
		var req;

		// Add proxy to URL if needed
		if(proxy) url = 'https://jsonp.afeld.me/?url=' + url;

		// Prepare the request object
		req = new XMLHttpRequest();
		req.open('GET', url, true);

		// Define callback or when data is received
		req.onload = function() {
			if(this.status >= 200 && this.status < 400) {
				callback(null, JSON.parse(this.responseText));
			} else {
				callback(this.statusText, null);
			}
		};

		// Define callback for errors
		req.onerror = function() {
			callback(this.statusText, null);
		};

		// Send request and return
		req.send();
		return;
	};

	// An object to hold JSONP callbacks (these must be globally accessable)
	out.JSONPCBs = {};

	// An internal function for creating JSONP element IDs
	JSONPcount = 0;
	getJSONPuid = function() {
		JSONPcount = JSONPcount + 1;
		return 'JSONP_ID_' + JSONPcount;
	};

	// A function to make JSONP queries work like regular AJAX
	// This uses jsonp.afeld.me proxy to make JSONP work with all APIs
	out.getJSONP = function(url, callback, proxy) {
		if(proxy === undefined) proxy = true; // Set default value
		var elem, uid;

		// Generate a UID for the new tag and it's callback
		uid = getJSONPuid();

		// Build the script tag
		elem = document.createElement('script');
		if(proxy) {
			url = 'https://jsonp.afeld.me/?callback=h.JSONPCBs.' + uid + '&url=' + url;
		} else {
			url = url + '&callback=h.JSONPCBs.' + uid;
		}
		elem.src = url;
		elem.id = uid;

		// Create a callback for the JSONP request
		out.JSONPCBs[uid] = function(data) {
			// Remove the script tag we created and it's handler before calling the callback
			var elem = out.id(uid);
			elem.parentNode.removeChild(elem);
			delete out.JSONPCBs[uid];
			callback(null, data);
		};

		// Set a timeout to make sure the script tag and it's function get removed
		setTimeout(function() {
			var elem = out.id(uid);
			if(elem !== null) elem.parentNode.removeChild(elem);
			delete out.JSONPCBs[uid];
		}, 10000);

		// Append the new script element to start the request
		out.tag('head')[0].appendChild(elem);
	};

	// Simple wrapper to make writing easier
	out.id = function(id) {
		return document.getElementById(id);
	};

	// Simple wrapper to make writing easier
	out.class = function(cls) {
		return document.getElementsByClassName(cls);
	};

	// Simple wrapper to make writing easier
	out.tag = function(tag) {
		return document.getElementsByTagName(tag);
	};

	// Simple wrapper to make writing easier
	out.selector = function(selector) {
		return document.querySelectorAll(selector);
	};

	// Simple function to add classes
	out.addClass = function(elem, cls) {
		if(elem.className.match(new RegExp('(\\s+|^)' + cls + '(\\s+|$)')) === null) elem.className += ' ' + cls;
	};

	return out;
})();
