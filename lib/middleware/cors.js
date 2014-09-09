var config = require('config');

module.exports = function() {
	return function(req, res, next) {
		var origin = req.header('Origin');
		if (origin) {
			if (config.admin.origins.indexOf(origin).indexOf === -1) {
				res.send(403);
			} else {
				res.header('Access-Control-Allow-Origin', origin);
				if (req.method.toUpperCase() === 'OPTIONS') {
					// preflight requests
					res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-API-Key, Accept');
					res.header('Access-Control-Allow-Methods', 'GET, POST');
					res.send(200);
				} else {
					next();
				}
			}
		} else {
			next();
		}
	};
};
