module.exports = {
	/**
	 * @see http://phpjs.org/functions/ip2long/
	 * @param  {String} ip v4/v6 IP Address
	 * @return {Number}
	 */
	ip2long: function(IP) {
		var i = 0;
		IP = IP.match(/^([1-9]\d*|0[0-7]*|0x[\da-f]+)(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?$/i); // Verify IP format.
		if (!IP)
			return false;

		IP[0] = 0;
		for (i = 1; i < 5; i += 1) {
			IP[0] += !! ((IP[i] || '').length);
			IP[i] = parseInt(IP[i]) || 0;
		}
		IP.push(256, 256, 256, 256);
		IP[4 + IP[0]] *= Math.pow(256, 4 - IP[0]);
		if (IP[1] >= IP[5] || IP[2] >= IP[6] || IP[3] >= IP[7] || IP[4] >= IP[8])
			return false;

		return IP[1] * (IP[0] === 1 || 16777216) + IP[2] * (IP[0] <= 2 || 65536) + IP[3] * (IP[0] <= 3 || 256) + IP[4] * 1;
	},
	/**
	 * @see http://phpjs.org/functions/long2ip/
	 * @param {Number} 
	 * @return {String} ip IP v4/v6 address
	 */
	long2ip: function(ip) {
		if (!isFinite(ip))
    		return false;
		return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
	}
}