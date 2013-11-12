/*
 * LeadEngine
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

/**
 * Upgrades a lead object from v2 to v3.  The lead object itself will be
 * modified, and the returned value will be the same physical object.
 *
 * @param {Object} lead The v2 lead to be upgraded.
 * @returns {Object} A v3 lead.
 */
function upgrade(lead) {
	// LeadModel must be required within this function to avoid a dual-
	// dependency issue.
	var lm = require('../../../../models/LeadModel');
	lm.generateLeadDataHashes(lead);
	return lead;
}

// Public API Mapping
module.exports = {
	upgrade: upgrade
};