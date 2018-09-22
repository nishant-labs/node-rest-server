import express from 'express';
import { RouteProvider } from './providers';
import { initializeLogger, logger } from './utils/Logger';
import RequestHandler from './utils/RequestHandler';
const errorHandler = require('errorhandler');

export default (routeConfig, serverConfig = {}) => {
	const app = express();
	initializeLogger(serverConfig.logger);
	try {
		app.set('port', serverConfig.port || 8000);

		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));

		app.use('*', (request, response, next) => {
			const data = RequestHandler.getRequestData(request);
			logger.info('Request URL : ', JSON.stringify(data.url));
			logger.info('Request headers : ', JSON.stringify(data.headers));
			logger.info('Request body : ', JSON.stringify(data.body));
			next();
		});

		app.get('/status', (request, response) => {
			response.send(app._router.stack);
		});

		Object.keys(routeConfig).forEach(value => {
			const data = routeConfig[value];
			const uri = `${serverConfig.basePath || ''}${value}`;
			if (typeof data.method === 'string') {
				const method = String(data.method);
				logger.info('Registering route path:', method.toUpperCase(), uri);
				app[method.toLowerCase()](
					uri,
					RouteProvider(data, serverConfig)
				);
			}
		});

		if (app.get('env') === 'development') {
			app.use(errorHandler());
		}

		app.listen(app.get('port'), () => {
			logger.info('Server started listening on port', app.get('port'));
		});
	} catch (error) {
		logger.error(error);
	}
};
