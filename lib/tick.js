/*
 * Copyright (c)2011-2013 Leadnomics Inc.
 */

/**
 * Schedules a callback to be executed in a certain number of ticks.
 *
 * @param {Number} ticks The number of ticks that should execute before the
 *      callback is fired.
 * @param {Function} cb A callback argument to be fired after waiting the
 *      specified number of ticks.
 */
function inTicks(ticks, cb) {
	if (ticks > 0) {
		process.nextTick(function() {
			inTicks(ticks - 1, cb);
		});
	}
	else
		cb();
}

module.exports = {
	inTicks: inTicks
};