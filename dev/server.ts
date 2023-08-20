import NodeRestServer, { HttpRequest, ControllerOptions, RouteConfiguration, ServerConfiguration } from '../lib';

interface MyData {
	gender: string;
	name: string;
}

const testData: RouteConfiguration = {
	'/test/data/name': {
		method: 'POST',
		status: 200,
		controller: (requestData: HttpRequest) => {
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
		controller: async (requestData: HttpRequest, controllerOptions: ControllerOptions) => {
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
		controller: async () => {
			return await Promise.resolve({ payload: { place: 'The World is Async' } });
		},
	},
	'/test/data/async/error': {
		method: 'GET',
		status: 200,
		controller: ({ filter }: HttpRequest) => {
			console.log('Filter Data: ', JSON.stringify(filter));
			throw Error('error');
		},
	},
	'/remove/data': {
		method: 'DELETE',
		controller: ({ filter }: HttpRequest) => {
			console.log('Filter Data: ', JSON.stringify(filter));
			return { status: 200 };
		},
	},
	'/data/name/:id': [
		{
			method: 'GET',
			controller: () => ({
				status: 500,
				payload: { data: 'get data' },
			}),
		},
		{
			method: 'POST',
			controller: (requestData: HttpRequest) => {
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
	},
	getDatabaseConnection: async () => {
		return Promise.resolve('me');
	},
	filter: (requestData: HttpRequest) => {
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
};

NodeRestServer(testData, serverConfigs);
