/**
 * @module Number
 * @copyright(c)2011-2013 Leadnomics Inc.
 */

var stringUtil = require('./string');

module.exports = {
	/**
	 * @param n {Number} Number to round.
	 * @param [precision] {Number} Optional number of decimals to round to. Defaults to 2.
	 * @return {Number}
	 */
	round: function(n, precision) {
		precision = (undefined === precision) ? 2 : Number(precision);
		var fact = Number(stringUtil.pad('1', 1+precision, '0'));
		return Math.floor(fact * Number(n))/fact;
	}
}
