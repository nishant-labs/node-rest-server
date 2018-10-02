import express from 'express';
import { RouteProvider, MiddlewareProvider } from './providers';
import { initializeLogger, logger } from './utils/Logger';
import { initPreProcessors } from './utils/ServerProcessor';
import ErrorHandler from './handlers/ErrorHander';

export default (routeConfig, serverConfig = {}) => {
	logger.info('Loading resources and starting server');
	const app = express();
	logger.debug('initializing application logger with', JSON.stringify(serverConfig.logger));
	initializeLogger(serverConfig);
	try {
		logger.debug('Applying preprocessors');
		initPreProcessors(app, serverConfig);

		logger.debug('Applying global middlewares');
		MiddlewareProvider.registerRequestLogger(app);
		MiddlewareProvider.registerFilters(app, serverConfig);
		MiddlewareProvider.registerStatusEndpoint(app);

		Object.keys(routeConfig).forEach(value => {
			const data = routeConfig[value];
			const uri = `${serverConfig.basePath || ''}${value}`;
			if (typeof data.method === 'string') {
				const method = String(data.method);
				logger.info('Registering route path:', method.toUpperCase(), uri);
				app[method.toLowerCase()](uri, RouteProvider(data, serverConfig));
			}
		});

		ErrorHandler.registerDevHandler(app);

		app.listen(app.get('port'), () => {
			logger.info('Server started listening on port', app.get('port'));
		});
	} catch (error) {
		logger.error(error);
	}
};
