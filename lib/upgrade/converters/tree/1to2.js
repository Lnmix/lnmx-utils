/*
 * LeadEngine
 * Copyright (c)2011-2012 Leadnomics Inc.
 */

/**
 * Upgrades a tree from v1 to v2.  The tree object itself will be modified,
 * and the returned value will be the same physical object.
 *
 * @param {Object} tree The v1 tree to be upgraded.
 * @returns {Object} A v2 tree.
 * @throws {Error} If the supplied tree is not version 1.
 */
function upgrade(tree) {
	delete tree.auctionType;
	return tree;
}

// Public API Mapping
module.exports = {
	upgrade: upgrade
};