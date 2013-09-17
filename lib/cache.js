/*
 * LeadEngine
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

// Dependencies
var LRU = require('lru-cache');

// Constants
const KEY_DELIMITER = '`';

/**
 * Dynamically builds a key from an array of elements.  This is slightly more
 * RAM-friendly than using JSON.stringify on the array, as a simple value
 * delimiter is used rather than polluting the result with unnecessary quotes
 * and braces.
 *
 * @param {Array} elems An array of elements to be included in the key
 * @return {String} A key string containing a representation of the provided
 *      elements.
 */
LRU.prototype.makeKey = function(elems) {
	var key = '';
	for (var i = 0; i < elems.length; i++) {
		if (i > 0)
			key += KEY_DELIMITER;
		if (elems[i] instanceof Array)
			key += '[' + this.makeKey(elems[i]);
		else if (typeof elems[i] == 'object')
			key += JSON.stringify(elems[i]);
		else
			key += elems[i];
	}
	return key;
};

/**
 * Gets the given key from the cache if it exists.  If not, the provided
 * function is executed to populate the cache, and the resulting value is
 * passed back.
 *
 * @param {String|Array} key A key under which the value should be cached.  If
 *      an array is provided, it will be passed through {@link #makeKey} to
 *      produce a string representation.
 * @param {Function} valFunc A function to execute to populate the cache if the
 *      given key is not found.  The only argument this function will be called
 *      with is a callback function.  Its first argument should be an error
 *      object if an error occurred; its second argument should be the result
 *      to be cached.
 * @param {Function} cb A callback function to be executed when the value is
 *      found.  Arguments supplied to this function are:
 *          - An error object, if an error occurred
 *          - The value associated with the provided key
 */
LRU.prototype.recache = function(key, valFunc, cb) {
	if (key instanceof Array)
		key = this.makeKey(key);
	var val = this.get(key),
		self = this;
	if (val)
		cb(null, val);
	else {
		valFunc(function(err, result) {
			if (!err)
				self.set(key, result);
			cb(err, result);
		});
	}
};

/**
 * Wraps a getter-with-callback function in a recache layer that will
 * automatically return a cached value for the given set of arguments if
 * such a key exists; or, if not, will execute the wrapped function and cache
 * the result.
 *
 * @param {String} keyBase A key unique to the type of value being saved.
 *      Generally, this could be the wrapped function's name.
 * @param {Function} valFunc The function that would normally be called to
 *      retrieve a non-cached result through a callback function.  An example
 *      may be a function that's defined as getPerson(personID, callback).
 * @param {Object} [options] An optional set of options to customize the
 *      wrapper's functionality.  Available settings are:
 *          - {Array} [args] Can be used to override any arguments that the
 *            function was actually called with.  This is useful when a wrapper
 *            must be created and used within the context of an executing
 *            function.  Can also be a javascript arguments object.
 *          - {Object} [context] The context in which the valFunc should be
 *            executed.  This is useful in object context, where the valFunc
 *            makes use of the 'this' keyword.
 * @return {Function} A wrapped version of the given function that will attempt
 *      to access a cached result before executing the function.
 */
LRU.prototype.recacheWrap = function(keyBase, valFunc, options) {
	var cache = this;
	if (!options)
		options = {};
	return function() {
		var args = Array.prototype.slice.call(options.args || arguments),
			cb = args.pop(),
			key = keyBase + KEY_DELIMITER + cache.makeKey(args),
			context = options.context || this;
		function regen(cacheVal) {
			args.push(cacheVal);
			valFunc.apply(context, args);
		}
		cache.recache(key, regen, cb);
	};
};

// Public interface
module.exports = LRU;