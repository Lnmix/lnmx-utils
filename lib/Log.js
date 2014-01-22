/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

// Dependencies
var config = require('config'),
	async = require('async'),
	engines = require('./log/engines'),
	formatters = require('./log/formatters');

/**
 * Formats a log messages in the following JSON format:
 *
 * {
 *    date: [Javascript Date object],
 *    logLevel: 1-4,
 *    logLabel: ERROR, WARN, INFO, DEBUG or TRACE,
 *    messages: [
 *      "Error message string",
 *      [Javascript Error object],
 *      { meta: 'data' }
 *    ],
 *    file: "File containing log call",
 *    line: "Line number of log call in above file",
 * }
 *
 * Note that only date, logLevel, logLabel, and messages are guaranteed to be
 * in the response.
 *
 * @param {Number} logLevel The severity level of the log message.  See
 *      {@link #log} for an enumeration.
 * @param messages An array of messages to be logged, or the 'arguments'
 *      variable from a function call.
 * @returns {Object} A javascript object in the above format.
 */
function buildLogObject(logLevel, messages) {
	if (!(messages instanceof Array))
		messages = Array.prototype.slice.call(messages);
	var stack = new Error().stack.split('\n'),
		caller = stack.length > 4 ?
			stack[4].match(/^\s+at.*\s\(?([^:]+):(\d+):(\d+)/) : [],
		labels = ['', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'],
		msgObj = {
			date: new Date(),
			logLevel: logLevel,
			logLabel: logLevel < labels.length ? labels[logLevel] : '',
			messages: messages
		};
	if (caller && caller.length == 4) {
		msgObj.file = caller[1];
		msgObj.line = caller[2];
		var cwd = process.cwd();
		if (cwd.length < msgObj.file.length &&
				cwd.toLowerCase() ==
				msgObj.file.substr(0, cwd.length).toLowerCase()) {
			msgObj.file = msgObj.file.substr(cwd.length);
		}
	}
	return msgObj;
}


/**
 * Logs a trace message.
 *
 * This function accepts a variable number of arguments of any type.  Each will
 * be logged as a string.
 */
function trace() {
	log(5, arguments);
}


/**
 * Logs a debug message.
 *
 * This function accepts a variable number of arguments of any type.  Each will
 * be logged as a string.
 */
function debug() {
	log(4, arguments);
}

/**
 * Logs an error message.
 *
 * This function accepts a variable number of arguments of any type.  Each will
 * be logged as a string.
 */
function error() {
	log(1, arguments);
}

/**
 * Logs an info message.
 *
 * This function accepts a variable number of arguments of any type.  Each will
 * be logged as a string.
 */
function info() {
	log(3, arguments);
}

/**
 * Logs a message or group of messages at a certain severity level.  Severity
 * levels are as follows:
 *
 * 1: Error
 * 2: Warning
 * 3: Information
 * 4: Debug
 *
 * Messages will be logged using the log engine specified in the config file.
 * If the specified engine does not exist or fails to load, or if the specified
 * engine reports an error when logging the message, the Console engine
 * will be used.
 *
 * @param {Number} logLevel The severity level at which to log the message(s).
 * @param {Array} messages An array of messages to be logged, or a javascript
 * 		'arguments' object.
 * @param {Function} callback An optional callback to be executed whenever the
 *      message has been logged.  No arguments are passed to this function.
 */
function log(logLevel, messages, callback) {
	if (config.log && config.log.length) {
		var logObj = buildLogObject(logLevel, messages);
		async.forEach(config.log, function(target, cb) {
			if (target && (!target.hasOwnProperty('logLevel') ||
					logLevel <= target.logLevel)) {
				logToTarget(target, logObj, cb);
			} else
				cb();
		}, function(err) {
			if (callback)
				callback();
		});
	}
}

/**
 * Logs a Log Object to the specified target.  A target is a definition for a
 * log output, formatted like the following:
 *
 * {
 *   engine: "File",
 *   logLevel: 3,
 *   formatter: "Human",
 *   options: {
 *     path: "/tmp/log"
 *   },
 *   fallback: {
 *     // Optionally, a nested log target
 *   }
 * }
 *
 * @param {Object} target The log target to which the message will be sent.
 * @param {Object} logObj A log object as produced by {@link #buildLogObject}.
 * @param {Function} callback A callback function to be executed when this
 *      function is complete.  Arguments provided are:
 *          - An error object, if an error occurred that prevented logging.
 */
function logToTarget(target, logObj, callback) {
	// What we do if this target fails
	function fail(err) {
		if (target.fallback)
			logToTarget(target.fallback, logObj, callback);
		else if (callback)
			callback(err);
	}
	// Let's try it
	var engine, formatter, failure;
	try {
		engine = engines[target.engine];
		formatter = formatters[target.formatter];
	}
	catch (e) {
		failure = e;
	}
	if (failure)
		fail(failure);
	else {
		engine.log(formatter.format(logObj), target.options || {},
			function(err) {
				if (err)
					fail(err);
				else if (callback)
					callback();
			});
	}
}

/**
 * Converts any javascript type to a string, with a focus on giving the best
 * detail possible for an error message.
 *
 * @param elem The javascript element to be converted to an error string.
 * @return {String} The element in string form.
 */
function toErrorString(elem) {
	if (elem === null) return 'null';
	switch (typeof elem) {
		case 'undefined': return 'undefined';
		case 'string': return elem;
		case 'number': return "" + elem;
		case 'boolean': return elem ? 'true' : 'false';
		default:
			if (elem instanceof Error)
				return elem.message;
			if (elem instanceof Object) {
				try {
					return JSON.stringify(elem);
				}
				catch (e) {}
			}
			if (elem.toString)
				return elem.toString();
			return "" + elem;
	}
}

/**
 * Logs a warning message.
 *
 * This function accepts a variable number of arguments of any type.  Each will
 * be logged as a string.
 */
function warn() {
	log(2, arguments);
}

// Public API mapping
module.exports = {
	trace: trace,
	debug: debug,
	error: error,
	info: info,
	toErrorString: toErrorString,
	warn: warn
};