/*
 * LeadEngine
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

// Dependencies
var objUtil = require('../object');

function parseParameters(req, res, next) {
	var params = {};
	objUtil.forEach(req.headers, function(key, val) {
		var match = key.match(/^x-lnmx-(.+)$/);
		if (match)
			params[match[1]] = val;
	});
	objUtil.forEach(req.query, function(key, val) {
		params[key] = val;
	});
	objUtil.forEach(req.params, function(key, val) {
		params[key] = val;
	});
	if (req.body && typeof req.body == 'object') {
		objUtil.forEach(req.body, function(key, val) {
			params[key] = val;
		});
	}
	req.parameters = params;
	next();
}

// Export middleware
module.exports = parseParameters;