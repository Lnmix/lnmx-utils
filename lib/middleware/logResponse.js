/*
 * LeadEngine
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

// Dependencies
var log = require('../Log'),
	objUtil = require('../object');

// Constants
const BLOCKED_VAL = '(BLOCKED)';
const ELEM_PREFIX = 'R_';

/**
 * Returns a function used to log an API response.
 *
 * @param {String} key A key used to group common requests, such as a route
 * @param {Object} options An options object.  Available options are:
 *      - {Array} blocks: An array of keys whose contents should be obfuscated
 *        before sent to the logger.
 * @returns {Function} An express middleware function
 */
function logResponse(key, options) {
	if (!options)
		options = {};
	var app = options.app || 'leadengine';
	return function (req, res, next) {
		var params = {},
			jsonContent = typeof res.content == 'object' ? res.content : {};
		objUtil.forEach(jsonContent, function(key, val) {
			if (options.blocks) {
				var blocked = options.blocks.some(function(block) {
					return key == block;
				});
			}
			var pKey = ELEM_PREFIX + key;
			if (blocked)
				params[pKey] = BLOCKED_VAL;
			else
				params[pKey] = val;
		});
		log.info({
			event: 'API Response',
			eventId: app + ':api:res',
			uuid: req.uuid || 'none',
			route: key,
			method: req.method,
			pubId: req.publisher ? (req.publisher.id || 'none') : 'none',
			pubName: req.publisher ? (req.publisher.name || 'none') : 'none',
			statusCode: res.statusCode
		}, params);
		next();
	};
}

// Export middleware
module.exports = logResponse;
