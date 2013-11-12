/*
 * LeadEngine
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

// Dependencies
var objUtil = require('../object');

/**
 * Overrides any parameters that were set in the request with other values, or
 * adds any that did not previously exist.  Note that this will not change the
 * value of parameters within req.params or req.body; it only changes the
 * req.parameters object set by the parseParameters middleware.  As such, that
 * middleware must be run first.
 *
 * @param {Object} params A mapping of key/value pairs to set in req.parameters
 * @return {Function} An Express middleware function
 */
function overrideParams(params) {
	if (!params)
		params = {};
	return function(req, res, next) {
		objUtil.forEach(params, function(key, val) {
			req.parameters[key] = val;
		});
		next();
	}
}

// Export Middleware
module.exports = overrideParams;
