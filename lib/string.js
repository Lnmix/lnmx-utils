/*
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

/**
 * Produces a date string in the following format:
 *
 * YYYY-MM-DD HH:MM:SS
 *
 * @param {Date} date A javascript date object to convert to string form.  If
 *      not specified, the current date will be used.
 * @returns {String} A date string in the above format.
 */

module.exports = {

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
	pad: function(subject, length, character, prefix) {
		subject = "" + subject;
		while (subject.length < length) {
			if (prefix)
				subject = character + subject;
			else
				subject += character;
		}
		return subject;
	},
	/**
	 * 
	 * @return {[type]} [description]
	 */
	empty: function(input) {
		if (!input)
			return true;

		if ('boolean' === typeof input)
			return input;

		if (input instanceof Array)
			return 0 == input.length;

		if (!isNaN(input))
			return 0 >= Number(input);
		else
			return 0 == String(input).length;
	},
	/**
	 * Converts any javascript type to a string, with a focus on giving the best
	 * detail possible for an error message.
	 *
	 * @param elem The javascript element to be converted to an error string.
	 * @return {String} The element in string form.
	 */
	toErrorString: function(elem) {
		if (elem === null) return 'null';
		switch (typeof elem) {
			case 'undefined': return 'undefined';
			case 'string': return elem.replace("\n", "\\n");
			case 'number': return "" + elem;
			case 'boolean': return elem ? 'true' : 'false';
			default:
				if (elem instanceof Error)
					return "<Err: " + elem.message + ">";
				if (typeof elem == 'object')
					return JSON.stringify(elem);
				if (elem.toString)
					return elem.toString();
				return "" + elem;
		}
	},

	/**
	 * Converts a json string to an object and returns false if string is not valid JSON
	 * @param  {String} json String of json to parse
	 * @return {Object}      Javascript object of parsed string
	 */
	parseJSON: function(json) {
    	try {
        	return JSON.parse(json);
    	} catch(e) {
	        return undefined;
    	}
    }

};