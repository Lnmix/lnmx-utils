/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

/**
 * Upgrades an auction state object from v2 to v3.  The auction state object
 * itself will be modified, and the returned value will be the same physical
 * object.  Any data types that this auction contains (tree, buyers, etc) will
 * be upgraded as well, if necessary.
 *
 * @param {Object} state The v2 auction state to be upgraded.
 * @returns {Object} A v3 auction state.
 */
function upgrade(state) {
	if (state.hasOwnProperty('saleDate'))
		delete state.saleDate;
	return state;
}

// Public API Mapping
module.exports = {
	upgrade: upgrade
};