import { RuleObject, ValidationSchema } from 'fastest-validator';
import { ServerConfiguration } from '../../types/config.types';

const serverSettingsProperties: ValidationSchema<Required<ServerConfiguration>> = {
	basePath: {
		type: 'string',
		default: '',
	},
	port: {
		type: 'number',
		positive: true,
		integer: true,
		default: 8000,
	},
	headers: {
		type: 'multi',
		rules: [{ type: 'object' }, { type: 'function' }],
		optional: true,
	},
	delay: {
		type: 'number',
		positive: true,
		integer: true,
		default: 0,
	},
	logger: {
		type: 'multi',
		rules: [
			{ type: 'boolean' },
			{
				type: 'object',
				props: {
					enable: { type: 'boolean', default: true },
					debug: { type: 'boolean', default: false },
					beautifyJSON: { type: 'boolean', default: false },
				},
			},
		],
		default: true,
	},
	filter: { type: 'function', optional: true },
	cors: { type: 'any', optional: true },
	getDatabaseConnection: { type: 'function', optional: true },
	https: { type: 'any', optional: true },
	middlewares: { type: 'function', optional: true },
};

export const serverSettingsSchema: RuleObject = {
	$$root: true,
	strict: true,
	type: 'object',
	optional: true,
	messages: {
		objectStrict: "Server settings contains forbidden keys: '{actual}', valid properties are '{expected}'",
	},
	properties: serverSettingsProperties,
};
