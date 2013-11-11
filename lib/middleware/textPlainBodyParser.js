/*
 * LeadEngine
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

/**
 * Parses plain text data in stores the contents in req.body. Used only by the
 * directPost method.
 * 
 * @param {Request} req	Request object
 * @param {Object} options Options used to configure the parser
 * @param {Function} callback Callback to call once body has been parsed
 */
function bodyParser(req, options, callback) {

	if (req.get('content-type') != 'text/plain') {
		return(callback());
	}

	var data = '';
	req.on('data', function(chunk) {
		data += chunk.toString('utf8');
	});

	req.on('end', function() {
		req.parameters.body = data;
		callback();
	});

}

module.exports = bodyParser;

