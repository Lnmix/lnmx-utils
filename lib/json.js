var libxml = require('libxmljs');

var parse = function(str, fn) {
	try {
		fn(null, JSON.parse(str));
	} catch (err) {
		fn(err);
	}
};

var makeElement = function(parent, name, value) {
	if (Array.isArray(value)) {
		value.forEach(function(value_) {
			makeElement(parent, name, value_);
		})
	} else if ('object' === typeof value) {
		if ('@' === name) {
			parent.attr(value)
		} else {
			var node = parent.node(name);
			Object.keys(value).forEach(function(k) {
				makeElement(node, k, value[k]);
			});
		}
	} else if ('undefined' === typeof value) {
		// replicates JSON.stringify's behavior: ignores undefined values
	} else {
		parent.node(name, value);
	}
};

module.exports = {
	parse: parse,
	toXml: function(obj, root, fn) {
		var doc = libxml.Document();
		try {
			var parent = (root) ? doc.node(root) : doc;
			Object.keys(obj).forEach(function(k) {
				makeElement(parent, k, obj[k]);
			});
			fn(undefined, doc);
		} catch (e) {
			fn(e);
		}
	}
};