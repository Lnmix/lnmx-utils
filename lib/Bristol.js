var config = require('config'),
	log = require('bristol');

const TARGETS = {
	'file': 'file',
	'console': 'console',
	'sns': require('./bristol/targets/sns')
};
const FORMATTERS = {
	'json': 'json',
	'human': 'human',
	'syslog': 'syslog',
	'commoninfomodel': 'commonInfoModel'
};

if (config.log) {
	config.log.map(function(l) {
		if (l) {
			var target =log.addTarget(TARGETS[String(l.engine || l.target).toLowerCase()], l.options || {})
						.withFormatter(FORMATTERS[String(l.formatter).toLowerCase()]);

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