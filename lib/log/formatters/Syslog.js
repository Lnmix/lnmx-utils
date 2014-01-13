/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

// Dependencies
var dateUtil = require('../../date'),
	objUtil = require('../../object'),
	strUtil = require('../../string'),
	os = require('os');

module.exports.format = function(logObj) {
	var project = "pricing";
	var str = dateUtil.getSyslogDate(logObj.date) + ' ' +
		os.hostname() + ' ' + project + '[' + process.pid + ']:';
	// Concat the messages, add object keys
	var obj = {
		logLevel: logObj.logLevel,
		logLabel: logObj.logLabel
	};
	if (logObj.hasOwnProperty('file'))
		obj.file = logObj.file;
	if (logObj.hasOwnProperty('line'))
		obj.line = logObj.line;
	logObj.messages.forEach(function(msg) {
		if (typeof msg == 'object' && !(msg instanceof Error)) {
			for (var i in msg) {
				if (msg.hasOwnProperty(i)) {
					var key = objUtil.findFreeKey(obj, i, '.');
					obj[key] = strUtil.toErrorString(msg[i]);
				}
			}
		}
		else {
			str += ' ' + strUtil.toErrorString(msg);
			if (msg instanceof Error) {
				var errKey = objUtil.findFreeKey(obj, 'stackTrace');
				obj[errKey] = msg.stack.replace(/\s*\n\s*/g, " | ");
			}
		}
	});
	// Append the metadata
	var meta = '';
	for (var i in obj) {
		if (obj.hasOwnProperty(i))
			meta += ', ' + i + '=' + obj[i];
	}
	return str + meta.substr(1);
};
