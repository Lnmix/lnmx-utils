var config = require('config'), aws = require('aws-sdk');
aws.config.update({
        accessKeyId: config.aws.accessKeyID,
        secretAccessKey: config.aws.secretAccessKey,
        region: config.aws.region || 'us-east-1'
});
var sns = new aws.SNS();

module.exports = function(options, severity, date, message) {
	var obj = JSON.parse(msg);
    var query = {
        Message: msg,
        Subject: obj.eventId,
        TopicArn: 'arn:aws:sns:' + options.region + ':' + options.accountNumber  + ':' + options.topic
    }
	sns.publish(query);
};