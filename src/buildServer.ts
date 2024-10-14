import express, { Express } from 'express';
import { RouteProvider, MiddlewareProvider } from './providers/index';
import { initializeLogger, logger } from './utils/Logger';
import { initPreProcessors } from './utils/ServerProcessor';
import { registerDevErrorHandler } from './handlers/ErrorHander';
import { validateServerSettings } from './schema-validators/index';
import { getControllerOptions } from './handlers/RequestHandler';
import { hasUniqueMethods } from './utils/array';
import { RouteConfigItem, RouteConfiguration } from './types/route.types';
import { ServerConfiguration, ControllerOptions } from './types/config.types';

const registerMethod = (app: Express, endpoint: string, endpointHandlerConfigItem: RouteConfigItem, controllerOptions: ControllerOptions, serverConfig: ServerConfiguration) => {
	const uri = `${serverConfig.basePath || ''}${endpoint}`;
	if (typeof endpointHandlerConfigItem.method === 'string') {
		const method = String(endpointHandlerConfigItem.method);
		logger.info('Registering route path:', method.toUpperCase(), uri);

		if (endpointHandlerConfigItem.middlewares?.length) {
			// @ts-expect-error unsafe call to support dynamic generator
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			app[method.toLowerCase()](uri, ...endpointHandlerConfigItem.middlewares, RouteProvider(endpointHandlerConfigItem, controllerOptions, serverConfig));
		} else {
			// @ts-expect-error unsafe call to support dynamic generator
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			app[method.toLowerCase()](uri, RouteProvider(endpointHandlerConfigItem, controllerOptions, serverConfig));
		}
	}
};

export function buildNodeRestServer(routeConfig: RouteConfiguration, serverConfig: ServerConfiguration = {}): Express {
	validateServerSettings(serverConfig);
	logger.info('Loading resources and starting server');
	const app = express();
	logger.debug('initializing application logger with', serverConfig.logger);
	initializeLogger(serverConfig);
	logger.debug('Applying preprocessors');
	initPreProcessors(app, serverConfig);

	logger.debug('Applying global middlewares');
	MiddlewareProvider.registerRequestLogger(app);
	MiddlewareProvider.registerFilters(app, serverConfig);
	MiddlewareProvider.registerStatusEndpoint(app);
	MiddlewareProvider.registerMiddlewares(app, serverConfig);

	const controllerOptions = getControllerOptions(serverConfig);

	Object.keys(routeConfig).forEach((endpoint) => {
		const endpointHandlerConfigs = routeConfig[endpoint];
		if (Array.isArray(endpointHandlerConfigs)) {
			if (hasUniqueMethods(endpointHandlerConfigs)) {
				endpointHandlerConfigs.forEach((endpointHandlerConfigItem) => {
					registerMethod(app, endpoint, endpointHandlerConfigItem, controllerOptions, serverConfig);
				});
			} else {
				logger.error('Multiple handlers for same http method found for endpoint : ', endpoint);
			}
		} else {
			registerMethod(app, endpoint, endpointHandlerConfigs, controllerOptions, serverConfig);
		}
	});

	registerDevErrorHandler(app);

	return app;
}
