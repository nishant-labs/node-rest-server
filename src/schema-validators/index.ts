import { serverSettingsValidator } from './validators';
import { logger } from '../utils/Logger';
import { ERROR } from '../constants/content';
import { ServerConfiguration, ValidatorResponse } from '../types/config.types';
import { ValidationError } from 'fastest-validator';

const commonResultProcessor = (result: ValidatorResponse, type: string) => {
	if (result !== true && !(result instanceof Promise)) {
		const formattedMessages = result.map(({ message }: ValidationError) => `\n${message as string}`);
		throw Error([`${ERROR.VALIDATION_MESSAGE} ${type}`, ...formattedMessages].join(''));
	}
};

export const validateServerSettings = (serverConfig?: ServerConfiguration) => {
	logger.info('Validating Server settings');
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
	const validationStatus: ValidatorResponse = serverSettingsValidator(serverConfig);
	commonResultProcessor(validationStatus, 'server settings');
};
