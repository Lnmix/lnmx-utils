module.exports = function(keys, headerName) {
	keys = keys || [];
	headerName = headerName || 'X-API-Key';
	return function(req, res, next) {
		var key = req.header(headerName);
		if (!key) {
			res.send(401);
		} else if (keys.indexOf(key) === -1) {
			res.send(403);
		} else {
			next();
		}
	};
};
