import errorHandler from 'errorhandler';
import { logger } from '../utils/Logger';
import { Express } from 'express';

export const registerDevErrorHandler = (app: Express) => {
	if (app.get('env') === 'development') {
		logger.debug('Loading Error handler');
		app.use(errorHandler());
	}
};
