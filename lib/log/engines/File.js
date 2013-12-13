/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

// Dependencies
var fs = require('fs');

// Private members
var streams = {};

/**
 * Gets a Node.js WriteStream object for a given file, creating it if it does
 * not exist.  The WriteStream will be created in 'append' mode, preserving the
 * file contents.
 *
 * @param {String} path The path to the file for which a WriteStream is needed.
 * @return {WriteStream} An active WriteStream object for the given file.
 */
function getStream(path) {
	if (!streams[path] || !streams[path].writable) {
		streams[path] = fs.createWriteStream(path, { flags: 'a' });
		streams[path].on('error', function(err) {
			// TODO: Figure out how to make log() return false instead of this.
			console.log('Error writing to "' + path + '":', err.message);
		});
	}
	return streams[path];
}

/**
 * Logs a message to a file.
 *
 * @param {String} msg A string to be logged.
 * @param {Object} options A set of options for this engine.
 * @param {Function} callback An optional callback function to be executed
 *      when the message has been logged.  Arguments provided are:
 *          - An error object, if an error occurred.
 */
function log(msg, options, callback) {
	var out = getStream(options.path);
	out.write(msg + "\n");
	if (callback)
		callback();
}

// Public API Mapping
module.exports = {
	log: log
};
