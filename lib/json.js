/**
 * @module Json
 * @copyright (c)2011-2013 Leadnomics Inc.
 */

var libxml;

var makeElement = function(parent, name, value) {
	if (/^\d*$/.test(name)) {
		var s = parent.name().slice(-1),
			ies = parent.name().slice(-3);

		if ('s' !== s) {
			throw new Error('Invalid element name: ' + name);
		} else {
			name = (ies === 'ies') ? parent.name().slice(0, -3)+'y' : parent.name().slice(0, -1);
		}
	}
	if ('object' === typeof value) {
		if ('@' === name) {
			parent.attr(value)
		} else {
			var node;
			if ('string' === typeof value["0"]) {
				node = parent;
			} else {
				node = parent.node(name);
			}

			Object.keys(value).forEach(function(k) {
				makeElement(node, k, value[k]);
			});
		}
	} else if ('undefined' === typeof value || value.length < 1) {
		// replicates JSON.stringify's behavior: ignores undefined values
	} else {
		parent.node(name, String(value));
	}
};

module.exports = {
	/**
	 * Parses JSON string
	 * @param str {String} JSON string
	 * @param fn {Function} Callback function
	 * @deprecated Use String.parseJSON instead
	 */
	parse: function(str, fn) {
		console.warn(new Error('@deprecated').stack);
    	try {
        	fn(null, JSON.parse(str));
    	} catch (err) {
        	fn(err);
    	}
	},
	/**
	 * Converts object to XML
	 * @param object {Object}
	 * @param [root] {String} Root element's name
	 * @param fn {Function} Callback function
	 * @todo Move to Object
	 */
	toXml: function(obj, root, fn) {
		if (!libxml)
			libxml = require('libxmljs');
		var doc = libxml.Document();
		try {
			var parent = (root) ? doc.node(root) : doc;
			Object.keys(obj).forEach(function(k) {
				makeElement(parent, k, obj[k]);
			});
		} catch (e) {
			return fn(e);
		}
		fn(undefined, doc);
	}
};
