import { Express } from 'express';
import { logger } from '../utils/Logger';
import { getRequestData } from '../handlers/RequestHandler';
import { errorHandler } from '../utils/ErrorUtils';
import { ServerConfiguration } from '../types/config.types';

export default class MiddlewareProvider {
	static registerRequestLogger(app: Express) {
		logger.debug('Registering request logger');
		app.use((request, _response, next) => {
			const data = getRequestData(request);
			logger.info('Request URL : ', JSON.stringify(data.url));
			logger.debug('Request headers : ', JSON.stringify(data.headers));
			logger.debug('Request body : ', JSON.stringify(data.body));
			next();
		});
	}

	static registerFilters(app: Express, serverConfig: ServerConfiguration) {
		logger.debug('Registering global filter');
		app.use((request, response, next) => {
			const data = getRequestData(request);
			if (typeof serverConfig.filter === 'function') {
				logger.info('Executing filter...');
				const filterData = serverConfig.filter(data);
				if (filterData instanceof Promise) {
					filterData.then((filterDataResponse: unknown) => {
						response.locals = filterDataResponse || {};
						next();
					}, errorHandler);
					return;
				}
				response.locals = filterData || {};
			}
			next();
		});
	}

	static registerStatusEndpoint(app: Express) {
		logger.debug('Registering /status endpoint to get routes information');
		app.get('/status', (_request, response) => {
			const { stack } = app._router as Record<string, Array<string>>;
			response.send(stack);
		});
	}
}
