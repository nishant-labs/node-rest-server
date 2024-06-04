import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(eslint.configs.recommended, ...tsEslint.configs.strictTypeChecked, {
	languageOptions: {
		parserOptions: {
			project: true,
			tsconfigRootDir: import.meta.dirname,
		},
	},
},
{
	files: ['**/*.js'],
	...tsEslint.configs.disableTypeChecked,
});
