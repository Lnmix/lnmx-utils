/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

var dateUtil = require('../../date'),
	objUtil = require('../../object'),
	strUtil = require('../../string');

/**
 * Transforms a log object into a multiline, human-readable message.  Example:
 *
 * [2012-10-16 16:28:42] INFO: Lead not sold {auction:nosale} (/app/AuctionManager.js:245)
 *      activeAuctions: 0
 *      activeFuture: 0
 *      amount: 0
 *      pubId: 45
 *      pubName: Intimate Interactive Inc.
 *      test: 1
 *      tree: pdLegacy
 *      uuid: eaef85c7204e4adda6e8f7f49e74bfd0
 *      vertical: payday
 *
 * @param logObj
 * @return {String}
 */
module.exports.format = function(logObj) {
	var params = {},
		sortKeys = [],
		event = '',
		eventId = '',
		msg = '[' + dateUtil.getTimestamp(logObj.date) + '] ' +
			logObj.logLabel + ':';
	logObj.messages.forEach(function(item) {
		if (typeof item != 'object')
			msg += ' ' + strUtil.toErrorString(item);
		else {
			for (var key in item) {
				if (item.hasOwnProperty(key) && typeof item[key] != 'function') {
					switch (key) {
						case 'event':
							event = item[key]; break;
						case 'eventId':
							eventId = item[key]; break;
						default:
							sortKeys.push(key);
							params[key] = item[key];
					}
				}
			}
		}
	});
	msg += (event ? ' ' + event : '') + (eventId ? ' {' + eventId + '}' : '');
	if (logObj.file) {
		var meta = logObj.file;
		if (logObj.line)
			meta += ':' + logObj.line;
		msg += ' (' + meta + ')';
	}
	sortKeys.sort();
	for (var idx in sortKeys) {
		msg += "\n\t" + sortKeys[idx] + ": " + strUtil.toErrorString(params[sortKeys[idx]]);
	}
	return msg;
};
