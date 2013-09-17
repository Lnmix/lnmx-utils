/**
 * @copyright (c)2011-2013 Leadnomics Inc.
 * @module Date
 */

var assert = require('assert');
var strUtil = require('./string');

var monthsAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
	'Sep', 'Oct', 'Nov', 'Dec'];
/**
 * @see {@link http://www.php.net/manual/en/dateinterval.construct.php}
 * @param {String} intervalSepc
 * @constructor
 */
var DateInterval = function(interval_spec) {
	assert(/P((\d)Y)?((\d)M)?((\d)D)?((\d)W)?(T((\d)H)?((\d)M)?((\d)S)?)?/gi.test(interval_spec), 'Unknown or bad format ('+interval_spec+')');
	var m = /P((\d)Y)?((\d)M)?((\d)D)?((\d)W)?(T((\d)H)?((\d)M)?((\d)S)?)?/gi.exec(interval_spec);
	/**
	 * @property y {Number} years
	 */
	this.y = parseInt(m[2]) || 0;
	/**
	 * @property m {Number} months
	 */
	this.m = parseInt(m[4]) || 0;
	if (m[6]) {
		this.d = parseInt(m[6]);
	} else if (m[8]) {
		this.d = 7 * parseInt(m[8]);
	} else {
		/**
		 * @property d {Number} days
		 */
		this.d = 0;
	}
	/**
	 * @property h {Number} hours
	 */
	this.h = (m[9] && m[11]) ? parseInt(m[11]) : 0;
	/**
	 * @property i {Number} minutes
	 */
	this.i = (m[9] && m[13]) ? parseInt(m[13]) : 0;
	/**
	 * @property s {Numbers} seconds
	 */
	this.s = (m[9] && m[15]) ? parseInt(m[15]) : 0;	
};

/**
 * @see {@link http://php.net/manual/en/class.dateperiod.php}
 * @param {Date} Start date
 * @param {DateInterval} Interval
 * @param {Date|Number} End date / number of recurrences
 * @param {Object} Options. Only one valid key ATM: excludeStartDate (Boolean)
 * @return {Array} Array of Date objects
 */
var DatePeriod = function(start, interval, third, options) {
  options = options || {excludeStartDate: false};
  assert(start instanceof Date);
  assert(interval instanceof DateInterval);
  assert('number' === typeof third || third instanceof Date);
  
  var period = [];
  var last = new Date(start.getTime());
  if (!options.excludeStartDate)
    period.push(last);
  while(third instanceof Date ? last.getTime() < third.getTime() : --third) {
    last = new Date(last.getTime());
    last.setFullYear(last.getFullYear()+interval.y);
    last.setMonth(last.getMonth()+interval.m);
    last.setDate(last.getDate()+interval.d);
    last.setHours(last.getHours()+interval.h);
    last.setMinutes(last.getMinutes()+interval.i);
    last.setSeconds(last.getSeconds()+interval.s);
    period.push(last);    
  }
  return period;
};

var DateUtil = module.exports = {
	/**
	 * Returns a string formatted according to the given format string using 
	 * the given date object or the current time if no date is given
	 * @todo support more format characters
	 * @see {@link http://www.php.net/manual/en/function.date.php}
	 * @param  {String} format
	 * @param  {Date} date
	 * @return {String}
	 */
	format: function(format, date) {
		date = date || new Date();
		format = format.replace('d', strUtil.pad(date.getDate(), 2, '0', true));
		// D : Mon through Sun
		format = format.replace('m', strUtil.pad(1+date.getMonth(), 2, '0', true));
		format = format.replace('n', 1+date.getMonth());

		format = format.replace('j', date.getDate());
		format = format.replace('Y', date.getFullYear());
		return format;
	},

	DateInterval: DateInterval,

	DatePeriod: DatePeriod,

	/**
	 * Produces a date string in standard Syslog format, in the server's local
	 * time zone:
	 *
	 * Jan 4 18:05:47
	 *
	 * @param {Date} date A javascript date object to convert to string form.
	 *      If not specified, the current date will be used.
	 * @return {String} A date string in the above format.
	 */
	getSyslogDate: function(date) {
		if (!date)
			date = new Date();
		return monthsAbbr[date.getMonth()] + ' ' + date.getDate() + ' ' +
			strUtil.pad(date.getHours(), 2, 0, true) + ':' +
			strUtil.pad(date.getMinutes(), 2, 0, true) + ':' +
			strUtil.pad(date.getSeconds(), 2, 0, true);
	},

	/**
	 * Produces a date string in the following format, in the server's local
	 * time zone:
	 *
	 * YYYY-MM-DD HH:MM:SS
	 *
	 * @param {Date} date A javascript date object to convert to string form.
	 *      If not specified, the current date will be used.
	 * @returns {String} A date string in the above format.
	 */
	getTimestamp: function(date) {
		if (!date)
			date = new Date();
		return date.getFullYear() + '-' +
			strUtil.pad(date.getMonth() + 1, 2, 0, true) + '-' +
			strUtil.pad(date.getDate(), 2, 0, true) + ' ' +
			strUtil.pad(date.getHours(), 2, 0, true) + ':' +
			strUtil.pad(date.getMinutes(), 2, 0, true) + ':' +
			strUtil.pad(date.getSeconds(), 2, 0, true);
	},

	/**
	 * Produces a date string in the following format, in UTC:
	 *
	 * YYYY-MM-DD HH:MM:SS
	 *
	 * @param {Date} date A javascript date object to convert to string form.
	 *      If not specified, the current date will be used.
	 * @returns {String} A date string in the above format.
	 */
	getTimestampUTC: function(date) {
		if (!date)
			date = new Date();
		return date.getUTCFullYear() + '-' +
			strUtil.pad(date.getUTCMonth() + 1, 2, 0, true) + '-' +
			strUtil.pad(date.getUTCDate(), 2, 0, true) + ' ' +
			strUtil.pad(date.getUTCHours(), 2, 0, true) + ':' +
			strUtil.pad(date.getUTCMinutes(), 2, 0, true) + ':' +
			strUtil.pad(date.getUTCSeconds(), 2, 0, true);
	},
	/**
	 * @param {Date} Date object to modify
	 */
	toDayStart: function(date) {
		date.setHours(0);
		date.setMilliseconds(0);
		date.setMinutes(0);
	},
	/**
	 * @param {Date} Date object to modify
	 */
	toMonthStart: function(date) {
		DateUtil.toDayStart(date);
		date.setDate(1);
	},
	/**
	 * @param {Date} Date object to modify
	 */
	toWeekStart: function(date) {
		DateUtil.toDayStart(date);
		date.setDate(date.getDate() - date.getDay());
	}
};
