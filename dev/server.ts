import NodeRestServer, { RouteConfiguration, ServerConfiguration } from '../lib/index.mjs';

interface MyData {
	gender?: string;
	name?: string;
}

const testData: RouteConfiguration = {
	'/test/data/name': {
		method: 'POST',
		status: 200,
		controller: (requestData) => {
			const { gender, name } = requestData.body as MyData;
			return {
				status: 200,
				payload: {
					name: `Welcome ${gender === 'male' ? 'Mr' : 'Miss'} ${name ?? 'Anonymous'}`,
					Age: 28,
				},
			};
		},
	},
	'/test/data/data': {
		method: 'GET',
		status: 200,
		controller: async (requestData, controllerOptions) => {
			const { getDatabaseConnection } = controllerOptions;
			let dbData;
			if (getDatabaseConnection !== undefined) {
				dbData = await getDatabaseConnection(requestData);
			}
			return { payload: { place: 'The World', dbData } };
		},
	},
	'/test/data/async': {
		method: 'GET',
		status: 200,
		headers: {
			'Content-Type': 'text/html',
		},
		controller: async () => {
			return await Promise.resolve({ payload: { place: 'The World is Async' } });
		},
	},
	'/test/data/async/error': {
		method: 'GET',
		status: 200,
		controller: ({ filter }) => {
			console.log('Filter Data: ', JSON.stringify(filter));
			throw Error('error');
		},
	},
	'/remove/data': {
		method: 'DELETE',
		controller: ({ filter }) => {
			console.log('Filter Data: ', JSON.stringify(filter));
			return {
				status: 200,
				headers: {
					'x-some-date': Date.now().toLocaleString(),
				},
			};
		},
	},
	'/data/name/:id': [
		{
			method: 'GET',
			middlewares: [
				(_, __, next) => {
					next();
				},
			],
			controller: () => ({
				status: 500,
				payload: { data: 'get data' },
			}),
		},
		{
			method: 'POST',
			controller: (requestData) => {
				return {
					status: 500,
					payload: { requestData },
				};
			},
		},
	],
};

const serverConfigs: ServerConfiguration = {
	basePath: '/v2/api',
	port: 8080,
	delay: 2,
	logger: {
		enable: true,
		debug: true,
		file: 'server.log',
	},
	getDatabaseConnection: async () => {
		return Promise.resolve('me');
	},
	filter: (requestData) => {
		let isChecked = true;
		const { name } = requestData.body as MyData;
		if (name === 'test') {
			isChecked = false;
		}
		return Promise.resolve({ data: 'data calculated for each request', isChecked });
	},
	cors: {
		origin: '*',
	},
	headers: () => {
		return {
			'x-data': 'my header',
		};
	},
};

export default NodeRestServer(testData, serverConfigs);
