module.exports = function(opts) {
	opts = opts || {};
	opts.origins = opts.origins || [];
	opts.headers = opts.headers || [];
	opts.methods = opts.methods || ['GET', 'POST'];
	return function(req, res, next) {
		var origin = req.header('Origin');
		if (origin) {
			if (opts.origins.length && opts.origins.indexOf(origin) === -1) {
				res.status(403).end();
			} else {
				if (!opts.origins.length)
					origin = '*';

				res.header('Access-Control-Allow-Origin', origin);
				if (req.method.toUpperCase() === 'OPTIONS') {
					// preflight requests
					if (opts.headers.length)
						res.header('Access-Control-Allow-Headers',
							opts.headers.join(', '));
					if (opts.methods.length)
						res.header('Access-Control-Allow-Methods',
							opts.methods.join(', '));
					res.status(200).end();
				} else {
					next();
				}
			}
		} else {
			next();
		}
	};
};
