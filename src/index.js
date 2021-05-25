import express from 'express';
import { RouteProvider, MiddlewareProvider } from './providers';
import { initializeLogger, logger } from './utils/Logger';
import { initPreProcessors } from './utils/ServerProcessor';
import ErrorHandler from './handlers/ErrorHander';
import { validateServerSettings } from './schema-validators';
import { getControllerOptions } from './handlers/RequestHandler';

const NodeRestServer = (routeConfig, serverConfig = {}) => {
	try {
		validateServerSettings(serverConfig);
		logger.info('Loading resources and starting server');
		const app = express();
		logger.debug('initializing application logger with', JSON.stringify(serverConfig.logger));
		initializeLogger(serverConfig);
		logger.debug('Applying preprocessors');
		initPreProcessors(app, serverConfig);

		logger.debug('Applying global middlewares');
		MiddlewareProvider.registerRequestLogger(app);
		MiddlewareProvider.registerFilters(app, serverConfig);
		MiddlewareProvider.registerStatusEndpoint(app);
		const controllerOptions = getControllerOptions(serverConfig);

		Object.keys(routeConfig).forEach((value) => {
			const data = routeConfig[value];
			const uri = `${serverConfig.basePath || ''}${value}`;
			if (typeof data.method === 'string') {
				const method = String(data.method);
				logger.info('Registering route path:', method.toUpperCase(), uri);
				app[method.toLowerCase()](uri, RouteProvider(data, controllerOptions, serverConfig));
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

const nodeServer = (module.exports = NodeRestServer);
nodeServer.NodeRestServer = NodeRestServer;
