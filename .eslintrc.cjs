module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends: 'eslint:recommended',
	parser: '@babel/eslint-parser',
	parserOptions: {
		ecmaVersion: 13,
		requireConfigFile: false,
		sourceType: 'module',
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single', { avoidEscape: true }],
		semi: ['error', 'always'],
		'comma-dangle': ['error', 'always-multiline'],
	},
};
