module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		project: true,
		ecmaVersion: 13,
		requireConfigFile: false,
		sourceType: 'module',
		tsconfigRootDir: __dirname,
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single', { avoidEscape: true }],
		semi: ['error', 'always'],
		'comma-dangle': ['error', 'always-multiline'],
		"@typescript-eslint/ban-ts-comment": 0
	},
};
