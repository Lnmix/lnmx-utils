/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

/**
 * Logs a message to the console.
 *
 * @param {String} msg A string to be logged.
 * @param {Object} options A set of options for this engine.
 * @param {Function} callback An optional callback function to be executed
 *      when the message has been logged.  Arguments provided are:
 *          - An error object, if an error occurred.
 */
function log(msg, options, callback) {
	console.log(msg);
	if (callback)
		callback();
}

// Public API Mapping
module.exports = {
	log: log
};
