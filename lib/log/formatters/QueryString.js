/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

var dateUtil = require('lnmx-utils').Date,
	objUtil = require('lnmx-utils').Object,
	strUtil = require('lnmx-utils').String,
	qs = require('querystring');

module.exports.format = function(logObj) {
	// Construct the object to be query-formatted
	var obj = {
		date: dateUtil.getTimestamp(logObj.date),
		logLevel: logObj.logLevel,
		logLabel: logObj.logLabel,
		message: ''
	};
	if (logObj.hasOwnProperty('file'))
		obj.file = logObj.file;
	if (logObj.hasOwnProperty('line'))
		obj.line = logObj.line;
	// Stringify the date
	if (logObj.date)
		logObj.date = dateUtil.getTimestamp(logObj.date);
	// Concat the messages, add object keys
	logObj.messages.forEach(function(msg) {
		if (typeof msg == 'object' && !(msg instanceof Error)) {
			for (var i in msg) {
				if (msg.hasOwnProperty(i)) {
					var key = objUtil.findFreeKey(obj, i);
					obj[key] = strUtil.toErrorString(msg[i]);
				}
			}
		}
		else {
			obj.message += ' ' + strUtil.toErrorString(msg);
			if (msg instanceof Error) {
				var errKey = objUtil.findFreeKey(obj, 'stackTrace');
				obj[errKey] = msg.stack.replace(/\s*\n\s*/g, " | ");
			}
		}
	});
	if (obj.message)
		obj.message = obj.message.substr(1);
	else
		delete obj.message;
	return qs.stringify(obj);
};
