module.exports = function(keys) {
	keys = keys || [];
	return function(req, res, next) {
		var key = req.header('X-API-Key');
		if (!key) {
			res.send(401);
		} else if (keys.indexOf(key) === -1) {
			res.send(403);
		} else {
			next();
		}
	};
};
