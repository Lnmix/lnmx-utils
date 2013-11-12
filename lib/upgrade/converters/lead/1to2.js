/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

/**
 * Upgrades a lead object from v1 to v2.  The lead object itself will be
 * modified, and the returned value will be the same physical object.
 *
 * @param {Object} lead The v1 lead to be upgraded.
 * @returns {Object} A v2 lead.
 */
function upgrade(lead) {
	if (lead.purchaseInfo) {
		lead.sales = [lead.purchaseInfo];
		delete lead.purchaseInfo;
	}
	return lead;
}

// Public API Mapping
module.exports = {
	upgrade: upgrade
};