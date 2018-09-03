import express from 'express';
import { RouteProvider } from './providers';

const errorHandler = require('errorhandler');

export default (path, options = {}) => {
	const app = express();

	app.set('port', options.port);

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.get('/status', (request, response) => {
		response.send(app._router.stack);
	});

	Object.keys(path).forEach((value) => {
		const data = path[value];
		const uri = `${options.basePath}${value}`;
		if (typeof data.method === 'string') {
			app[String(data.method).toLowerCase()](uri, RouteProvider(data, options));
		}
		
	});
	
	if (app.get('env') === 'development') {
		app.use(errorHandler());
	}
	
	
	app.listen(app.get('port'), () => console.log('Example app listening on port', app.get('port'))); // eslint-disable-line
};
