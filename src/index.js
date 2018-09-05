import express from 'express';
import { RouteProvider } from './providers';
import Printer from './utils/Printer';
const errorHandler = require('errorhandler');

export default (routeConfig, serverConfig = {}) => {
	try {
		const app = express();

		app.set('port', serverConfig.port || 8000);

		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));

		app.get('/status', (request, response) => {
			response.send(app._router.stack);
		});

		Object.keys(routeConfig).forEach(value => {
			const data = routeConfig[value];
			const uri = `${serverConfig.basePath || ''}${value}`;
			if (typeof data.method === 'string') {
				app[String(data.method).toLowerCase()](
					uri,
					RouteProvider(data, serverConfig)
				);
			}
		});

		if (app.get('env') === 'development') {
			app.use(errorHandler());
		}

		app.listen(app.get('port'), () =>
			Printer.yellow('Rest Server Listening on port', app.get('port'))
		);
	} catch (error) {
		Printer.red(error);
	}
};
