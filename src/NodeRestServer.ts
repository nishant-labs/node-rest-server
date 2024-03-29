import * as http from 'http';
import express, { Express } from 'express';
import { RouteProvider, MiddlewareProvider } from './providers/index';
import { initializeLogger, logger } from './utils/Logger';
import { initPreProcessors } from './utils/ServerProcessor';
import ErrorHandler from './handlers/ErrorHander';
import { validateServerSettings } from './schema-validators/index';
import { getControllerOptions } from './handlers/RequestHandler';
import { hasUniqueMethods } from './utils/array';
import { RouteConfigItem, RouteConfiguration } from './types/route.types';
import { ServerConfiguration, ControllerOptions, RestServer } from './types/config.types';

const registerMethod = (app: Express, endpoint: string, endpointHandlerConfigItem: RouteConfigItem, controllerOptions: ControllerOptions, serverConfig: ServerConfiguration) => {
	const uri = `${serverConfig.basePath || ''}${endpoint}`;
	if (typeof endpointHandlerConfigItem.method === 'string') {
		const method = String(endpointHandlerConfigItem.method);
		logger.info('Registering route path:', method.toUpperCase(), uri);

		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		app[method.toLowerCase()](uri, RouteProvider(endpointHandlerConfigItem, controllerOptions, serverConfig));
	}
};

export function NodeRestServer(routeConfig: RouteConfiguration, serverConfig: ServerConfiguration = {}): RestServer {
	let server: http.Server;
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
					endpointHandlerConfigs.forEach((endpointHandlerConfigItem) => registerMethod(app, endpoint, endpointHandlerConfigItem, controllerOptions, serverConfig));
				} else {
					logger.error('Multiple handlers for same http method found for endpoint : ', endpoint);
				}
			} else {
				registerMethod(app, endpoint, endpointHandlerConfigs, controllerOptions, serverConfig);
			}
		});

		ErrorHandler.registerDevHandler(app);

		server = app.listen(app.get('port'), () => {
			logger.info('Server started listening on port', app.get('port') as string);
		});
	} catch (error: unknown) {
		logger.error(error as string);
	}
	return {
		close: (forced: boolean) =>
			new Promise<Error | undefined>((resolve): void => {
				if (!server) {
					resolve(new Error('Server instance not found'));
				}

				if (forced) {
					server.closeIdleConnections();
					server.closeAllConnections();
				}
				server.close(resolve);
			}),
		addListener: (event, listener) => {
			if (!server) {
				return;
			}
			return server.addListener(event, listener);
		},
	};
}

export default NodeRestServer;
