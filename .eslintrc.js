module.exports = {
	env: {
		es6: true,
		node: true
	},
	extends: 'eslint:recommended',
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 2015,
		sourceType: 'module'
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'comma-dangle': ['error', 'never']
	}
};
