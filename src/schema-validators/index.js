import { serverSettingsValidator } from './validators';
import { logger } from '../utils/Logger';
import { ERROR } from '../constants/content';

const commonResultProcessor = (result, type) => {
	if (result !== true) {
		const formattedMessages = result.map(({ message }) => `\n${message}`);
		throw Error([`${ERROR.VALIDATION_MESSAGE} ${type}`, ...formattedMessages].join(''));
	}
};

export const validateServerSettings = (serverConfig) => {
	logger.info('Validating Server settings');
	const validationStatus = serverSettingsValidator(serverConfig);
	commonResultProcessor(validationStatus, 'server settings');
};
