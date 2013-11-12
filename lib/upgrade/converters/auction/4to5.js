/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

/**
 * Upgrades an auction state object from v4 to v5.  The auction state object
 * itself will be modified, and the returned value will be the same physical
 * object.  Any data types that this auction contains (tree, buyers, etc) will
 * be upgraded as well, if necessary.
 *
 * @param {Object} state The v4 auction state to be upgraded.
 * @returns {Object} A v5 auction state.
 */
function upgrade(state) {
	if (state.hasOwnProperty('startDate')) {
		state.runDates = [
			{
				start: state.startDate,
				state: state.lead.state || 'POST'
			}
		];
		delete state.startDate;
	}
	return state;
}

// Public API Mapping
module.exports = {
	upgrade: upgrade
};