/*
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

var stringUtil = require('./string');

module.exports = {
	round: function(n, precision) {
		precision = (undefined === precision) ? 2 : Number(precision);
		var fact = Number(stringUtil.pad('1', 1+precision, '0'));
		return Math.floor(fact * Number(n))/fact;
	}
}