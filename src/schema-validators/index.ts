import { serverSettingsValidator } from './validators';
import { ERROR } from '../constants/content';
import { ServerConfiguration } from '../types/config.types';
import { ValidatorResponse } from '../types/validators.types';
import { ValidationError } from 'fastest-validator';

const commonResultProcessor = (result: ValidatorResponse, type: string) => {
	if (result !== true && !(result instanceof Promise)) {
		const formattedMessages = result.map(({ message }: ValidationError) => `\n${message as string}`);
		throw Error([`${ERROR.VALIDATION_MESSAGE} ${type}`, ...formattedMessages].join(''));
	}
};

export const validateServerSettings = (serverConfig?: ServerConfiguration) => {
	console.log('Validating Server settings');
	const validationStatus: ValidatorResponse = serverSettingsValidator(serverConfig);
	commonResultProcessor(validationStatus, 'server settings');
};
