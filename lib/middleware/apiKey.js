var config = require('config');

module.exports = function() {
	return function(req, res, next) {
		var key = req.header('X-API-Key');
		if (!key) {
			res.send(401);
		} else if (config.admin.keys.indexOf(key) === -1) {
			res.send(403);
		} else {
			next();
		}
	};
};
