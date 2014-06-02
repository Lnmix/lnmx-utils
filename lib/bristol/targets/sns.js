/*
 * Bristol
 * Copyright 2014 Tom Frost
 */

const DEFAULT_REGION = 'us-east-1';

var aws;

var snsClients = {};

function getSNSClient(accessKey, secretKey, region) {
    var cid = accessKey + region;
    if (!snsClients[cid]) {
        if (!aws)
            aws = require('aws-sdk');
        snsClients[cid] = new aws.SNS({
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            region: region
        });
    }
    return snsClients[cid];
}

/**
 * Pushes a log message to Amazon SNS.
 * @param {{
 *      accessKey,
 *      secretKey,
 *      accountNumber,
 *      topic,
 *      subject,
 *      [region]
 * }} options The SNS target requires the following options:
 *          - {string} accessKey: An AWS account access key
 *          - {string} secretKey: The secret key associated with the access key
 *          - {string} accountNumber: The account number containing these
 *            credentials
 *          - {string} topic: The SNS topic to which the message should be sent
 *          - {string|function} subject: The subject under which the message
 *            should be sent, or a function that can be executed to return the
 *            subject.  The function will be provided with the following
 *            arguments:
 *              - {string} severity: The severity name for this log message
 *              - {Date} date: The date for this log message
 *              - {string} message: The message contents
 *      The following options are optional:
 *          - {string} region: The region housing the SNS topic in question.
 *            Default is 'us-east-1'.
 * @param {string} severity The severity of the log message
 * @param {Date} date The date of the log message
 * @param {string} message The message to be pushed to the SNS endpoint
 */
function log(options, severity, date, message) {
    var region = options.region || DEFAULT_REGION,
        client = getSNSClient(options.accessKey, options.secretKey, region),
        subject = options.subject;
    if (typeof subject == 'function')
        subject = subject(severity, date, message);
    var query = {
        Message: message,
        Subject: subject,
        TopicArn: 'arn:aws:sns:' + region + ':' + options.accountNumber + ':' +
            options.topic
    };
    client.publish(query, function(err, res) {
        if (err) {
            console.log("Error publishing log message to SNS topic: " +
                query.TopicArn + ".  Message was: " + message);
        }
    });
}

module.exports = log;