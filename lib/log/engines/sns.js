/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

// Dependencies
var config = require('config'), aws;
aws.config.update({
        accessKeyId: config.aws.accessKeyID,
        secretAccessKey: config.aws.secretAccessKey,
        region: config.aws.region || 'us-east-1'
});
var sns = new aws.SNS();


/**
 * Publishes a message to SNS.
 *
 * @param {String} msg A string to be logged.
 * @param {Object} options A set of options for this engine.
 * @param {Function} callback An optional callback function to be executed
 *      when the message has been logged.  Arguments provided are:
 *          - An error object, if an error occurred.
 */
function log(msg, options, callback) {
    if (!aws)
        aws = require('aws-sdk');
    var obj = JSON.parse(msg);
    if (obj.hasOwnProperty('eventId') && options.include.indexOf(obj.eventId) >= 0) {
        var query = {
            Message: msg,
            Subject: obj.eventId,
            TopicArn: 'arn:aws:sns:' + options.region + ':' + options.accountNumber  + ':' + options.topic
        }
		sns.publish(query, function(err, res) {
            callback(err);
        });
    }
}

// Public API Mapping
module.exports = {
    log: log
};