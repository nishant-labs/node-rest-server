import { logger } from '../utils/Logger';
import RequestHandler from '../handlers/RequestHandler';

export default class MiddlewareProvider {
	static registerRequestLogger(app) {
		logger.debug('Registering request logger');
		app.use((request, response, next) => {
			const data = RequestHandler.getRequestData(request);
			logger.info('Request URL : ', JSON.stringify(data.url));
			logger.info('Request headers : ', JSON.stringify(data.headers));
			logger.info('Request body : ', JSON.stringify(data.body));
			next();
		});
	}

	static registerFilters(app, serverConfig) {
		logger.debug('Registering global filter');
		app.use((request, response, next) => {
			const data = RequestHandler.getRequestData(request);
			if (typeof serverConfig.filter === 'function') {
				logger.info('Executing filter...');
				const localData = serverConfig.filter(data);
				response.locals = localData || {};
			}
			next();
		});
	}

	static registerStatusEndpoint(app) {
		logger.debug('Registering /status endpoint to get routes information');
		app.get('/status', (request, response) => {
			response.send(app._router.stack);
		});
	}
}
