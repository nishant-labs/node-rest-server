import express from 'express';
import { RouteProvider, MiddlewareProvider } from './providers';
import { initializeLogger, logger } from './utils/Logger';
import { initPreProcessors } from './utils/ServerProcessor';
import ErrorHandler from './handlers/ErrorHander';
import { validateServerSettings } from './schema-validators';
import { getControllerOptions } from './handlers/RequestHandler';
import { hasUniqueMethods } from './utils/array';

const registerMethod = (app, endpoint, endpointHandlerConfigItem, controllerOptions, serverConfig) => {
	const uri = `${serverConfig.basePath || ''}${endpoint}`;
	if (typeof endpointHandlerConfigItem.method === 'string') {
		const method = String(endpointHandlerConfigItem.method);
		logger.info('Registering route path:', method.toUpperCase(), uri);
		app[method.toLowerCase()](uri, RouteProvider(endpointHandlerConfigItem, controllerOptions, serverConfig));
	}
};

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

		Object.keys(routeConfig).forEach((endpoint) => {
			const endpointHandlerConfigs = routeConfig[endpoint];
			if (Array.isArray(endpointHandlerConfigs)) {
				if (hasUniqueMethods(endpointHandlerConfigs)) {
					endpointHandlerConfigs.forEach((endpointHandlerConfigItem) =>
						registerMethod(app, endpoint, endpointHandlerConfigItem, controllerOptions, serverConfig),
					);
				} else {
					logger.error('Multiple handlers for same http method found for endpoint : ', endpoint);
				}
			} else {
				registerMethod(app, endpoint, endpointHandlerConfigs, controllerOptions, serverConfig);
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

export { NodeRestServer, NodeRestServer as default };
