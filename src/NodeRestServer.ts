import * as http from 'node:http';
import * as https from 'node:https';
import { Express } from 'express';
import { logger } from './utils/Logger';
import { getServerReturnHandlers } from './utils/ServerProcessor';
import { RouteConfiguration } from './types/route.types';
import { ServerConfiguration, RestServer } from './types/config.types';
import { buildNodeRestServer } from './buildServer';

export function NodeRestServer(routeConfig: RouteConfiguration, serverConfig: ServerConfiguration = {}): RestServer {
	try {
		const app = buildNodeRestServer(routeConfig, serverConfig);

		let server: https.Server | Express = app;
		if (serverConfig.https) {
			server = https.createServer(serverConfig.https, app);
		}

		const serverInstance: http.Server = server.listen(app.get('port'), () => {
			logger.info('Server started listening on port', app.get('port') as string);
		});
		return getServerReturnHandlers(serverInstance);
	} catch (error: unknown) {
		logger.error(error as string);
		return getServerReturnHandlers();
	}
}

export default NodeRestServer;
