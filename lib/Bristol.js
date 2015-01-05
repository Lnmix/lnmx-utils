var config = require('config'),
	log = require('bristol');

const TARGETS = {
	'File': 'file',
	'file': 'file',
	'Console': 'console',
	'console': 'console',
	'sns': require('./bristol/targets/sns')
};
const FORMATTERS = {
	'Json': 'json',
	'json': 'json',
	'Human': 'human',
	'human': 'human',
	'Syslog': 'syslog',
	'syslog': 'syslog',
	'CommonInfoModel': 'commonInfoModel',
	'commonInfoModel': 'commonInfoModel'
};

if (config.log) {
	config.log.map(function(l) {
		if (l) {
			var target =log.addTarget(TARGETS[l.engine || l.target], l.options || {})
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
		}
	});
}

module.exports = log;