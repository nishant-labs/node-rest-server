import Express from 'express';
import { RouteProvider } from './providers';

export default  (path, options) => {
	console.log(path);  // eslint-disable-line
	console.log(options);  // eslint-disable-line

	const app = Express();
	app.get('/', RouteProvider);
	app.listen(3000, () => console.log('Example app listening on port 3000!')); // eslint-disable-line
};
