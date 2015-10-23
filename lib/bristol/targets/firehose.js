const DEFAULT_REGION = 'us-east-1';

var Firehose = require('aws-sdk').Firehose,
	fireHoseClients = {},
	buffer = [],
	flushTimeout = null;

function getClient(accessKey, secretKey, region) {
	var cid = accessKey + region;
	if (!fireHoseClients[cid]) {
		fireHoseClients[cid] = new Firehose({
			accessKeyId: accessKey,
			secretAccessKey: secretKey,
			apiVersion: '2015-08-04',
			region: region
		});
	}
	return fireHoseClients[cid];
}

function flush(client, stream, records) {
	var hoseParams = {
		DeliveryStreamName: stream,
		Records: records
	}
	client.putRecordBatch(hoseParams, function(err, res) {
		if (err) {
			console.log("Error pushing to firehose. Message was: ", err);
		}
	});

}
function log(options, severity, date, message) {
	var region = options.region || DEFAULT_REGION,
		bufferOpts = options.buffer || {},
		client = getClient(options.accessKey, options.secretKey, region);
		bufferOpts.size = bufferOpts.size || 10;
		bufferOpts.interval = bufferOpts.interval || 10;
		buffer.push({
			Data: message + '\n'
		});

		if (buffer.length >= bufferOpts.size) {
			if (flushTimeout) {
				clearTimeout(flushTimeout);
				flushTimeout = null;
			}
			flush(client, options.stream, buffer.slice());
			buffer = [];
		} else if (buffer.length && !flushTimeout) {
			flushTimeout = setTimeout(function() {
				flush(client, options.stream, buffer.slice());
				buffer = [];
				flushTimeout = null;
			}, bufferOpts.interval * 1000)
		}
}

module.exports = log;