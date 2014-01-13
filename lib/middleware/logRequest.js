/*
 * LeadEngine
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

// Dependencies
var log = require('../Log'),
	objUtil = require('../object');

// Constants
const BLOCKED_VAL = '(BLOCKED)';
const PARAM_PREFIX = 'P_';

/**
 * Returns a function used to log an API request.
 *
 * @param {String} key A key used to group common requests, such as a route
 * @param {Object} options An options object.  Available options are:
 *      - {Array} blocks: An array of keys whose contents should be obfuscated
 *        before sent to the logger.
 * @returns {Function} An express middleware function
 */
function logRequest(key, options) {
	return function (req, res, next) {
		writeLog(key, req, options ? options.blocks : {}, options.app);
    	next();
	}
}

/**
 * Returns an express error handler used to log an API request.
 *
 * @param {String} key A key used to group common requests, such as a route
 * @param {Object} options An options object.  Available options are:
 *      - {Array} blocks: An array of keys whose contents should be obfuscated
 *        before sent to the logger.
 * @returns {Function} An express middleware function
 */
function logRequestError(key, options) {
	return function (err, req, res, next) {
		writeLog(key, req, options ? options.blocks : {}, options.app);
		next(err);
	}
}

/**
 * Writes the specifics of a parsed request to the log.
 *
 * @param {Object} req A Node.js request` object, run through the
 *      parseParameters middleware for Express.
 * @param {Array} blocks An array of parameter keys whose values should be
 *      blocked from entering the log message.
 */
function writeLog(key, req, blocks, app) {
	var params = {},
		app = app || 'leadengine';
	objUtil.forEach(req.parameters, function(key, val) {
		if (blocks) {
			var blocked = blocks.some(function(block) {
				return key == block;
			});
		}
		var pKey = PARAM_PREFIX + key;
		if (blocked)
			params[pKey] = BLOCKED_VAL;
		else
			params[pKey] = val;
	});
	log.info({
		event: 'API Request',
		eventId: app + ':api:req',
		uuid: req.uuid || 'none',
		route: key,
		method: req.method,
		url: req.url,
		headers: JSON.stringify(req.headers),
		remoteIP: req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress,
		pubId: req.publisher ? (req.publisher.id || 'none') : 'none',
		pubName: req.publisher ? (req.publisher.name || 'none') : 'none'
	}, params);
}

// Export middleware
module.exports = logRequest;
module.exports.logRequestError = logRequestError;