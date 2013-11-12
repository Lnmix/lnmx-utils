var util = require('util');

/**
 * ApiError is used to denote an issue with the client's request to 
 * the api. All api errors should contain a statusCode and a message
 * suitable for displaying to the client.
 */
var ApiError = function(message) {
    ApiError.super_.call(this, message);
    ApiError.super_.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.content = message;
    this.httpStatus = 500;
};
util.inherits(ApiError, Error);


var XmlFormatError = function(msg) {
    XmlFormatError.super_.call(this, msg);
    this.className = "XmlFormatError";
    this.httpStatus = 400;
};
util.inherits(XmlFormatError, ApiError);


var AuthenticationError = function(msg) {
    AuthenticationError.super_.call(this, msg);
    this.className = "AuthenticationError";
    this.httpStatus = 401;
	this.noLog = true;
};
util.inherits(AuthenticationError, ApiError);


var MissingParameterError = function(message) {
    MissingParameterError.super_.call(this, message);
    this.className = "MissingParameterError";
    this.httpStatus = 400;
};
util.inherits(MissingParameterError, ApiError);

var ResourceNotFoundError = function(message) {
    ResourceNotFoundError.super_.call(this, message);
    this.className = "ResourceNotFoundError";
    this.httpStatus = 404;
};
util.inherits(ResourceNotFoundError, ApiError);


module.exports = {
    ApiError: ApiError,
    AuthenticationError: AuthenticationError,
    XmlFormatError: XmlFormatError,
    MissingParameterError: MissingParameterError,
    ResourceNotFoundError: ResourceNotFoundError
};