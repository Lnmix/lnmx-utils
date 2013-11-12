/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

// Dependencies
var Class = require("simple-class").Class;

// Constants
const ONE_DAY = 24 * 60 * 60 * 1000;

// Private utility functions
/**
 * Turns a Javascript Date object into a string in the format "YYYY-MM-DD".
 *
 * @param {Date} date The Javascript Date object to be transformed.
 * @returns String A date string in the YYYY-MM-DD format.
 */
function dateToYMD(date) {
	return date.getFullYear() + '-' +
		pad(date.getMonth() + 1, 2, 0, true) + '-' +
		pad(date.getDate(), 2, 0, true);
}

/**
 * Gets the first event from a schedule-formatted day that matches any of the
 * provided events in the events array.  Results are returned in the following
 * format:
 *
 * <pre>
 * {
 *     time: 0800, // An integer representing 24-hour time
 *     event: "eventName"
 * }
 * </pre>
 *
 * @param {Object} day The day schedule to be scanned
 * @param {Array} events An array of events to check for
 * @param {Number} startTime An integer representing the 24-hour time at
 *      which to start scanning for events.
 * @param {Boolean} lookBehind true to look backwards from the start time,
 *      false to look into the future.
 * @returns {Object} An event object as described above if the event was found,
 *      or null if it was not.
 */
function getEventFromDay(day, events, startTime, lookBehind) {
	var times = getOrderedTimes(day,
		lookBehind ? startTime : null,
		lookBehind ? null : startTime);
	for (var i = 0, len = times.length; i < len; i++) {
		var time = times[lookBehind ? len - i - 1 : i];
		if (inArray(day[time], events)) {
			return {
				time: time,
				event: day[time]
			};
		}
	}
	return null;
}

/**
 * Extracts the military time keys from a day object, adds them to an array,
 * and sorts the array in ascending order.  Optionally, only times before or
 * after a certain time can be returned.
 *
 * @param {Object} day The day object to be iterated over.
 * @param {Number} [beforeTime] A 24-hour time that all returned times must
 *      fall before.  Optional; null to ignore.
 * @param {Number} [afterTime] A 24-hour time that all returned times must fall
 *      after.  Optional; null to ignore.
 * @returns {Array} A sorted array of military time strings.
 */
function getOrderedTimes(day, beforeTime, afterTime) {
	var times = [];
	if (day) {
		for (var timeStr in day) {
			if (day.hasOwnProperty(timeStr)) {
				var time = parseInt(timeStr);
				if ((!beforeTime || beforeTime >= time) &&
						(!afterTime || afterTime <= time))
					times.push(timeStr);
			}
		}
		times.sort();
	}
	return times;
}

/**
 * Determines whether a specified element exists as a value in a given array.
 *
 * @param needle An element to be searched for in the given array.
 * @param {Array} haystack An array to be searched for the given value.
 * @returns bool true if the needle was found; false otherwise.
 */
function inArray(needle, haystack) {
	var length = haystack.length;
	for (var i = 0; i < length; i++) {
		if (haystack[i] == needle)
			return true;
	}
	return false;
}

/**
 * Iterates through the elements of an array and determines if every element
 * evaluates to boolean true.
 *
 * @param {Array} ary The array to be tested.
 * @returns {Boolean} true if the array contains all true elements; false
 *      otherwise.
 */
function isAllTrue(ary) {
	for (var i = 0, len = ary.length; i < len; i++) {
		if (!ary[i])
			return false;
	}
	return true;
}

/**
 * Pads a string with a certain number of a certain character until an
 * allotment is reached.
 *
 * @param {String} subject The string to be padded.
 * @param {Number} length The length to which the string should be padded.
 * @param {String} character The character to use to pad the string.
 * @param {Boolean} prefix true to add the padding to the front of the string,
 * 		false to add it to the end.  If not specified, false is assumed.
 * @returns {String} The given string padded to the specifications.
 */
function pad(subject, length, character, prefix) {
	subject = "" + subject;
	while (subject.length < length) {
		if (prefix)
			subject = character + subject;
		else
			subject += character;
	}
	return subject;
}

/**
 * Creates an array of a specified length, filled with a predetermined value.
 *
 * @param {Number} length The length of the array.
 * @param pad The element with which to fill the array.
 * @returns {Array} A filled array of the specified length
 */
function preFilledArray(length, pad) {
	var ary = [];
	while (length--)
		ary.push(pad);
	return ary;
}

/**
 * Transforms an integer with a UNIX-style timestamp into a javascript Date
 * object.  If the supplied date is already a Date object, it will be returned.
 * If no date is supplied, a Date object with the current date will be
 * returned.
 *
 * @param {Date|Number} date A UNIX-style timestamp, date object, or otherwise
 *      to have converted to a Date.
 * @param {Boolean} nowIfNull true to return a Date object with the current
 *      time if no valid date was specified; false otherwise.
 * @return Date A Javascript Date object matching the specified data.
 */
function toDate(date, nowIfNull) {
	if (date && !(date instanceof Date))
		date = new Date(date);
	if (nowIfNull && (!date || date.toString() == 'Invalid Date'))
		date = new Date();
	return date;
}

/**
 * Removes any '0' characters from the front of a string.
 *
 * @param {String} str A string to strip the leading zeroes from.
 * @returns {String} A string without leading zeroes.
 */
function trimLeadingZeroes(str) {
	while (str[0] == '0')
		str = str.substr(1);
	return str;
}

/**
 * The Schedule class wraps the JSON-style schedule object defined in the
 * Data Types documentation linked below.  This wrapper provides useful
 * functions, such as determining the closest event of a certain type to a
 * certain date, in the past and future.
 *
 * @see https://leadnomics.jira.com/wiki/display/LSP/NoSQL+Data+Types
 */
var Schedule = Class.extend({

	/**
	 * Constructor for a new Schedule object.  Accepts a JSON-style schedule
	 * object as defined in the Buyer and Tree schemas available in the
	 * documentation linked below.
	 *
	 * @see https://leadnomics.jira.com/wiki/display/LSP/NoSQL+Data+Types
	 * @param {Object} schedule A schedule matching the format in the linked
	 *      documentation.
	 */
	init: function(schedule) {
		this.schedule = schedule;
	},

	/**
	 * Gets an object defining the events on the specified day, in the
	 * following format:
	 *
	 * <pre>
	 * {
	 *     "type": "weekly" | "date",
	 *     "day": 1,  // For 'weekly' only, 1=Sunday
	 *     "date": "2012-01-29", // For 'date' only
	 *     "events": {
	 *         "0800": "open",
	 *         "2300": "close"
	 *     }
	 * }
	 * </pre>
	 *
	 * If no events are defined on the given day, an empty object will be
	 * returned.
	 *
	 * @param {Date|Number} date A Date object or UNIX-timestamp specifying any
	 *      time during the day for which the schedule should be retrieved.
	 *      If omitted, the current day will be used.
	 * @returns Object An object describing the schedule for the day, or null
	 *      if there is no schedule for the given day.
	 */
	getDaySchedule: function(date) {
		date = toDate(date, true);
		var dateStr = dateToYMD(date);
		if (this.schedule.dates && this.schedule.dates[dateStr]) {
			return {
				type: 'date',
				date: dateStr,
				events: this.schedule.dates[dateStr]
			};
		}
		var day = (date.getDay() + 1).toString();
		if (this.schedule.weekly && this.schedule.weekly[day]) {
			return {
				type: 'weekly',
				day: day,
				events: this.schedule.weekly[day]
			}
		}
		return null;
	},

	/**
	 * Gets the last event to occur before a specified date and time.
	 * Optionally, this method can look for only a certain set of events.  The
	 * result of this search will return an object such as the following:
	 *
	 * <pre>
	 * {
	 *      date: [Date object]
	 *      event: "Event name"
	 * }
	 * </pre>
	 *
	 * @param {Date|Number} date A Date object or UNIX-timestamp specifying the
	 *      date and time from which the search should start looking backward
	 *      for an event.
	 * @param {Array|String} events An optional event name to which the search
	 *      should be restricted, or an array of events.
	 * @returns Object An event object as described above, or null if no such
	 *      event exists.
	 */
	getLastEvent: function(date, events) {
		date = toDate(date, true);
		if (!(events instanceof Array))
			events = [events];
		var weekdays = preFilledArray(7, false),
			startEpoch = date.getTime(),
			startDay = date.getDay(),
			startTime = date.getHours() * 100 + date.getMinutes(),
			lastWeekDate = new Date(date.getTime() - 7 * ONE_DAY),
			dates = this.getOrderedDates(date),
			i = 0,
			day, event, lastDate;
		if (dates.length) {
			lastDate = new Date(dates[0]);
			if (lastDate.getTime() < lastWeekDate.getTime())
				lastDate = lastWeekDate;
		}
		else
			lastDate = lastWeekDate;
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		lastDate.setHours(23);
		lastDate.setMinutes(59);
		lastDate.setSeconds(59);
		do {
			day = this.getDaySchedule(startEpoch - i * ONE_DAY);
			if (day) {
				event = getEventFromDay(day.events, events, i ? null :
					startTime, true);
				if (event) {
					var time = parseInt(trimLeadingZeroes(event.time)),
						target = new Date(startEpoch - i * ONE_DAY);
					target.setHours(Math.floor(time / 100));
					target.setMinutes(time % 100);
					target.setSeconds(0);
					return {
						date: target,
						event: event.event
					};
				}
				else if (day.type == 'weekly') {
					// TODO: Review for faulty logic
					weekdays[(startDay + i) % 7] = true;
				}
			}
		} while (lastDate.getTime() < startEpoch - ++i * ONE_DAY &&
			!isAllTrue(weekdays));
		return null;
	},

	/**
	 * Gets the next event to occur after a specified date and time.
	 * Optionally, this method can look for only a certain set of events.  The
	 * result of this search will return an object such as the following:
	 *
	 * <pre>
	 * {
	 *      date: [Date object]
	 *      event: "Event name"
	 * }
	 * </pre>
	 *
	 * @param {Date|Number} date A Date object or UNIX-timestamp specifying the
	 *      date and time from which the search should start looking forward
	 *      for an event.
	 * @param {Array|String} events An optional event name to which the search
	 *      should be restricted, or an array of events.
	 * @returns Object An event object as described above, or null if no such
	 *      event exists.
	 */
	getNextEvent: function(date, events) {
		date = toDate(date, true);
		if (!(events instanceof Array))
			events = [events];
		var weekdays = preFilledArray(7, false),
			startEpoch = date.getTime(),
			startDay = date.getDay(),
			startTime = date.getHours() * 100 + date.getMinutes(),
			lastWeekDate = new Date(date.getTime() + 7 * ONE_DAY),
			dates = this.getOrderedDates(date),
			i = 0,
			day, event, lastDate;
		if (dates.length) {
			lastDate = new Date(dates[dates.length - 1]);
			if (lastDate.getTime() < lastWeekDate.getTime())
				lastDate = lastWeekDate;
		}
		else
			lastDate = lastWeekDate;
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		lastDate.setHours(23);
		lastDate.setMinutes(59);
		lastDate.setSeconds(59);
		do {
			day = this.getDaySchedule(startEpoch + i * ONE_DAY);
			if (day) {
				event = getEventFromDay(day.events, events, i ? 0 : startTime);
				if (event) {
					var time = parseInt(trimLeadingZeroes(event.time)),
						target = new Date(startEpoch + i * ONE_DAY);
					target.setHours(Math.floor(time / 100));
					target.setMinutes(time % 100);
					target.setSeconds(0);
					return {
						date: target,
						event: event.event
					};
				}
				else if (day.type == 'weekly') {
					weekdays[(startDay + i) % 7] = true;
				}
			}
		} while (lastDate.getTime() > startEpoch + ++i * ONE_DAY &&
			!isAllTrue(weekdays));
		return null;
	},

	/**
	 * Finds all the dates in the "dates" section of the schedule, puts them
	 * into an array, and sorts them from oldest to newest.  Optionally, dates
	 * can be returned only within a certain range.
	 *
	 * @param {Date} startDate The date at which to start the listing.  No
	 *      dates before this date will be returned.  May be a Javascript Date
	 *      object, or any date representation that the Date() constructor
	 *      understands.  If omitted, all the earliest dates will be returned.
	 * @param {Date} endDate The date at which to end the listing.  No dates
	 *      after this date will be returned.  May be a Javascript Date object,
	 *      or any date representation that the Date() constructor understands.
	 *      If omitted, all the latest dates will be returned.
	 * @returns Array An array of dates (in string YYYY-MM-DD format) ordered
	 *      from oldest to newest.
	 */
	getOrderedDates: function(startDate, endDate) {
		var dates = [];
		startDate = startDate ? toDate(startDate).getTime() : null;
		endDate = endDate ? toDate(endDate).getTime() : null;
		if (this.schedule.dates) {
			for (var i in this.schedule.dates) {
				if (this.schedule.dates.hasOwnProperty(i)) {
					var time = new Date(this.schedule.dates[i]).getTime();
					if ((!startDate || startDate < time) &&
						(!endDate || endDate > time))
						dates.push(i);
				}
			}
		}
		dates.sort();
		return dates;
	}
});

module.exports = Schedule;