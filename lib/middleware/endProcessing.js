/*
 * LeadEngine
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

/**
 * This function intentionally does nothing.  When this "middleware" is placed
 * at the end of a middleware chain, next() is not called and therefore the
 * chain ends.
 */
function endProcessing(req, res, next) { }

// Export middleware
module.exports = endProcessing;