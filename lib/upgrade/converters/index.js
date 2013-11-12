module.exports = {
	auction: {
		'1to2': require('./auction/1to2'),
		'2to3': require('./auction/2to3'),
		'3to4': require('./auction/3to4'),
		'4to5': require('./auction/4to5')
	},
	lead: {
		'1to2': require('./lead/1to2'),
		'2to3': require('./lead/2to3')
	},
	tree: {
		'1to2': require('./tree/1to2')
	}
};