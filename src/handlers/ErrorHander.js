import errorHandler from 'errorhandler';
import { logger } from '../utils/Logger';

export default class ErrorHandler {
	static registerDevHandler(app) {
		if (app.get('env') === 'development') {
			logger.debug('Loading Error handler');
			app.use(errorHandler());
		}
	}
}
