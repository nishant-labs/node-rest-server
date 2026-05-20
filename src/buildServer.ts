import express, { Express } from 'express';
import { RouteProvider, MiddlewareProvider } from './providers/index';
import { initializeLogger, logger } from './utils/Logger';
import { initPreProcessors } from './handlers/ServerProcessor';
import { registerDevErrorHandler } from './handlers/ErrorHandler';
import { validateServerSettings } from './schema-validators/index';
import { getControllerOptions } from './handlers/RequestHandler';
import { hasUniqueMethods } from './utils/array';
import { RouteConfigItem, RouteConfiguration } from './types/route.types';
import { ServerConfiguration, ControllerOptions } from './types/config.types';

const registerMethod = (app: Express, endpoint: string, endpointHandlerConfigItem: RouteConfigItem, controllerOptions: ControllerOptions, serverConfig: ServerConfiguration) => {
	const uri = `${serverConfig.basePath || ''}${endpoint}`;
	if (typeof endpointHandlerConfigItem.method === 'string') {
		const method = String(endpointHandlerConfigItem.method);
		logger.info(`Registering route path: ${method.toUpperCase()} ${uri}`);

		const routeFn = (app as unknown as Record<string, unknown>)[method.toLowerCase()];
		if (typeof routeFn === 'function') {
			const callback = RouteProvider(endpointHandlerConfigItem, controllerOptions, serverConfig);
			if (endpointHandlerConfigItem.middlewares?.length) {
				(routeFn as (...args: unknown[]) => void).call(app, uri, ...endpointHandlerConfigItem.middlewares, callback);
			} else {
				(routeFn as (...args: unknown[]) => void).call(app, uri, callback);
			}
		}
	}
};

export function buildNodeRestServer(routeConfig: RouteConfiguration, serverConfig: ServerConfiguration = {}): Express {
	validateServerSettings(serverConfig);
	initializeLogger(serverConfig);

	logger.info('Loading resources and starting server');
	const app = express();
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
				logger.error(`Multiple handlers for same http method found for endpoint : ${endpoint}`);
			}
		} else {
			registerMethod(app, endpoint, endpointHandlerConfigs, controllerOptions, serverConfig);
		}
	});

	registerDevErrorHandler(app);

	return app;
}
