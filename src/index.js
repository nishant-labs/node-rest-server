import express from 'express';
const errorHandler = require('errorhandler');
import { RouteProvider } from './providers';
import { initializeLogger, logger } from './utils/Logger';
import RequestHandler from './utils/RequestHandler';

export default (routeConfig, serverConfig = {}) => {
	logger.info('Loading resources and starting server');
	const app = express();
	logger.debug('initializing application logger with', JSON.stringify(serverConfig.logger));
	initializeLogger(serverConfig.logger);
	try {
		app.set('port', serverConfig.port || 8000);

		logger.debug('loading json processor');
		app.use(express.json());
		logger.debug('loading URL encoder');
		app.use(express.urlencoded({ extended: true }));

		logger.debug('Applying global middleware');
		app.use((request, response, next) => {
			const data = RequestHandler.getRequestData(request);
			logger.info('Request URL : ', JSON.stringify(data.url));
			logger.info('Request headers : ', JSON.stringify(data.headers));
			logger.info('Request body : ', JSON.stringify(data.body));
			if (typeof serverConfig.filter === 'function') {
				const localData = serverConfig.filter(data);
				response.locals = localData || {};
			}
			next();
		});

		logger.debug('Registering /status endpoint to get routes information');
		app.get('/status', (request, response) => {
			response.send(app._router.stack);
		});

		Object.keys(routeConfig).forEach(value => {
			const data = routeConfig[value];
			const uri = `${serverConfig.basePath || ''}${value}`;
			if (typeof data.method === 'string') {
				const method = String(data.method);
				logger.info('Registering route path:', method.toUpperCase(), uri);
				app[method.toLowerCase()](uri, RouteProvider(data, serverConfig));
			}
		});

		if (app.get('env') === 'development') {
			logger.debug('Loading Error handler');
			app.use(errorHandler());
		}

		app.listen(app.get('port'), () => {
			logger.info('Server started listening on port', app.get('port'));
		});
	} catch (error) {
		logger.error(error);
	}
};
