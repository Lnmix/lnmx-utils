var config = require('config'),
	log = require('bristol');

const TARGETS = {
	'File': 'file',
	'Console': 'console',
	'sns': require('./bristol/targets/sns')
};
const FORMATTERS = {
	'Json': 'json',
	'Human': 'human',
	'Syslog': 'syslog',
	'CommonInfoModel': 'commonInfoModel'
};

if (config.log) {
	config.log.map(function(l) {
		var target =log.addTarget(TARGETS[l.engine], l.options || {})
						.withFormatter(FORMATTERS[l.formatter]);

		if (l.highestSeverity)
			target.withHighestSeverity(l.highestSeverity);
		if (l.lowestSeverity)
			target.withLowestSeverity(l.lowestSeverity);
		if (l.onlySeverity)
			target.withHighestSeverity(l.onlySeverity).withLowestSeverity(l.onlySeverity);

		if (l.include) {
			var includes = {};
			Object.keys(l.include).map(function(i) {
				includes[i] = l.include[i];
			});
			target.onlyIncluding(includes);
		}

		if (l.exclude) {
			var excludes = {};
			Object.keys(l.exclude).map(function(e) {
				excludes[e] = l.exclude[e];
			});
			target.exluding(exclude);
		}
	});
}

module.exports = log;