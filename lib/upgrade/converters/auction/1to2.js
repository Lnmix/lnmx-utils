/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

// Dependencies
var up = require('../../Upgrade'),
	objUtil = require('../../../object');

/**
 * Upgrades an auction state object from v1 to v2.  The auction state object
 * itself will be modified, and the returned value will be the same physical
 * object.  Any data types that this auction contains (tree, buyers, etc) will
 * be upgraded as well, if necessary.
 *
 * @param {Object} state The v1 auction state to be upgraded.
 * @returns {Object} A v2 auction state.
 */
function upgrade(state) {
	up.upgrade('tree', state.tree, 2);
	if (!state.script)
		state.script = objUtil.clone(state.tree.defaultScript);
	return state;
}

// Public API Mapping
module.exports = {
	upgrade: upgrade
};