/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

var converters = require('./converters');

/**
 * Upgrades a LeadEngine data type from an old version to a newer one.
 *
 * @param {String} type The type of data to be converted, such as 'tree' or
 *      'auction'.
 * @param {Object} data The object to be upgraded.  If the object has no
 *      'version' property, a version of 1 is assumed.
 * @param {Number} [maxVersion] The highest version number to which the object
 *      should be upgraded.  Note that the object may not be upgraded to the
 *      specified version if converters do not exist for it.  The value is
 *      optional; if unspecified, the object will be upgraded to the highest
 *      version for which a converter is available.
 * @return {Object} The upgraded object.
 */
function upgrade(type, data, maxVersion) {
	if (!(data instanceof Object))
		throw new Error('Cannot upgrade non-objects.');
	if (!data.version)
		data.version = 1;
	while (!maxVersion || (maxVersion && data.version < maxVersion)) {
		var conversion = data.version + 'to' + (data.version + 1);
		if (converters[type][conversion]) {
			data = converters[type][conversion].upgrade(data);
			data.version++;
		}
		else
			break;
	}
	return data;
}

// Public API Mapping
module.exports = {
	upgrade: upgrade
};