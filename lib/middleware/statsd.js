var onFinished = require('on-finished'),
	Lynx = require('lynx');

function makeClient(options) {
	return new Lynx(options.host || '127.0.0.1', options.port || 8125, options);
}

module.exports = function(options) {
	options = options || {};
	var client = options.client || makeClient(options),
		prefix = options.prefix || 'express';

	return function(req, res, next) {
		var start = +Date.now();

		onFinished(res, function() {
			var key = prefix + '.' + req.method;
			if (req.route)
				key += '.' + req.route.path;
			client.increment(key + '.' + res.statusCode);
			client.timing(key, Date.now() - start);
		});

		if (next)
			next();
	};
};