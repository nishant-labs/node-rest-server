import { Express } from 'express';
import { logger } from '../utils/Logger';
import { getRequestData } from '../handlers/RequestHandler';
import { ServerConfiguration } from '../types/config.types';
import { ExpressRequest, ExpressResponse, ExpressNextFunction } from '../types/express.types';

export const registerRequestLogger = (app: Express) => {
	logger.debug('Registering request logger');
	app.use((request, _response, next) => {
		const data = getRequestData(request);
		logger.info(`Request URL: ${data.method} ${new URL(data.url).pathname}`);
		logger.debug(`Request headers: ${JSON.stringify(data.headers)}`);
		logger.debug(`Request body: ${JSON.stringify(data.body)}`);
		next();
	});
};

export const registerFilters = (app: Express, serverConfig: ServerConfiguration) => {
	logger.debug('Registering global filter');
	app.use((request: ExpressRequest, response: ExpressResponse, next: ExpressNextFunction) => {
		const data = getRequestData(request);
		if (typeof serverConfig.filter === 'function') {
			logger.info('Executing filter...');
			try {
				const filterData = serverConfig.filter(data, request, response);
				if (filterData instanceof Promise) {
					filterData
						.then((filterDataResponse: unknown) => {
							response.locals = filterDataResponse ?? {};
							next();
						})
						.catch((error: unknown) => {
							logger.error({ err: error as Error }, 'Error occurred while applying filter');
							next(error as Error);
						});
					return;
				}
				response.locals = filterData ?? {};
			} catch (error: unknown) {
				logger.error({ err: error as Error }, 'Error occurred while applying filter');
				next(error as Error);
				return;
			}
		}
		next();
	});
};

export const registerStatusEndpoint = (app: Express) => {
	logger.debug('Registering /status endpoint to get routes information');
	app.get('/status', (_request, response) => {
		const router = (app as unknown as { _router?: { stack?: Array<unknown> } })._router;
		response.send(router?.stack ?? []);
	});
};

export const registerMiddlewares = (app: Express, serverConfig: ServerConfiguration) => {
	serverConfig.middlewares?.forEach((middleware) => {
		if (typeof middleware === 'function') {
			app.use(middleware);
		} else {
			throw new Error('Middleware should be a function');
		}
	});
};
