/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

/**
 * Upgrades an auction state object from v3 to v4.  The auction state object
 * itself will be modified, and the returned value will be the same physical
 * object.  Any data types that this auction contains (tree, buyers, etc) will
 * be upgraded as well, if necessary.
 *
 * @param {Object} state The v3 auction state to be upgraded.
 * @returns {Object} A v4 auction state.
 */
function upgrade(state) {
	if (state.snapshot && state.snapshot.stage) {
		var idx = 0;
		if (state.script && state.script instanceof Array) {
			for (; idx < state.script.length; idx++) {
				if (state.script[idx].action == state.snapshot.stage)
					break;
			}
		}
		state.snapshot.stage = idx;
	}
	return state;
}

// Public API Mapping
module.exports = {
	upgrade: upgrade
};