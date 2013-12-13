/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

// Dependencies
var dateUtil = require('../../date'),
	objUtil = require('../../object'),
	strUtil = require('../../string');

/**
 * Formats the log message in Common Information Model format, as defined in
 * the Splunk documentation linked below.
 *
 * @param {Object} logObj A standard log object.
 * @return {String} A log message in CIM format.
 * @see http://docs.splunk.com/Documentation/Splunk/latest/Knowledge/UnderstandandusetheCommonInformationModel
 */
module.exports.format = function(logObj) {
	var cim = dateUtil.getTimestampUTC(logObj.date),
		str = '';
	// Concat the messages, add object keys
	var obj = {};
	if (logObj.hasOwnProperty('file'))
		obj.file = logObj.file;
	if (logObj.hasOwnProperty('line'))
		obj.line = parseInt(logObj.line);
	logObj.messages.forEach(function(msg) {
		if (typeof msg == 'object' && !(msg instanceof Error)) {
			for (var i in msg) {
				if (msg.hasOwnProperty(i) && typeof msg[i] != 'function') {
					var key = objUtil.findFreeKey(obj, i);
					if (typeof msg[i] == 'number')
						obj[key] = msg[i];
					else {
						obj[key] =
							strUtil.toErrorString(msg[i]).replace(/"/gm, "'");
						obj[key] = obj[key].replace(/\s*[\r\n]+\s*/gm, '\\n');
					}
				}
			}
		}
		else {
			str += ' ' + strUtil.toErrorString(msg).replace(/"/gm, "'");
			if (msg instanceof Error) {
				var errKey = objUtil.findFreeKey(obj, 'stackTrace');
				obj[errKey] = msg.stack.replace(/\s*\n\s*/g, " | ")
					.replace('"', "'");
				if (msg.document) {
					var docKey = objUtil.findFreeKey(obj, 'document');
					obj[docKey] = msg.document.replace(/\s*\n+\s*/g, '\\n');
					obj[docKey] = obj[docKey].replace(/"/gm, "'");
				}
			}
		}
	});

	//
	// Default project name
	//
	var project = "pricing";

	// Add standard fields
	cim += ' name="' + (obj.event || logObj.logLabel) + '"';
	cim += ' event_id="' + (obj.eventId || project + ":" + logObj.logLabel) + '"';
	if (str) cim += ' desc="' + str.substr(1) + '"';
	cim += ' severity="' + logObj.logLabel + '"';
	cim += ' priority=' + logObj.logLevel;
	// Remove the fields we just used
	if (obj.event) delete obj.event;
	if (obj.eventId) delete obj.eventId;
	// Append the metadata
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			if (typeof obj[i] == 'number')
				cim += ' ' + i + '=' + obj[i];
			else
				cim += ' ' + i + '="' + obj[i] + '"';
		}
	}
	return cim;
};
