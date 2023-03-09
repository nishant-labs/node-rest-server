import { existsSync } from 'node:fs';
import { join } from 'node:path';

const testData = {
	'/test/data/name': {
		method: 'POST',
		status: 200,
		controller: (requestData) => {
			const { gender, name } = requestData.body;
			return {
				status: 200,
				payload: {
					name: `Welcome ${gender === 'male' ? 'Mr' : 'Miss'} ${name ? name : 'Anonymous'}`,
					Age: 28,
				},
			};
		},
	},
	'/test/data/data': {
		method: 'GET',
		status: 200,
		controller: async (requestData, options) => {
			const { getDatabaseConnection } = options;
			const dbData = await getDatabaseConnection(requestData);
			return { payload: { place: 'The World', dbData } };
		},
	},
	'/test/data/async': {
		method: 'GET',
		status: 200,
		controller: async () => {
			return { payload: { place: 'The World is Async' } };
		},
	},
	'/test/data/async/error': {
		method: 'GET',
		status: 200,
		controller: async ({ filter }) => {
			console.log('Filter Data: ', JSON.stringify(filter));
			throw Error('error');
		},
	},
	'/remove/data': {
		method: 'DELETE',
		
		controller: async ({ filter }) => {
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
			controller: (requestData) => {
				return {
					status: 500,
					payload: { requestData },
				};
			},
		},
	],
};

const serverConfigs = {
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
	filter: async (requestData) => {
		let isChecked = true;
		if (requestData.body.name === 'test') {
			isChecked = false;
		}
		return { data: 'data calculated for each request', isChecked };
	},
	cors: {
		origin: '*',
	},
};

const Start = async (file) => {
	const { NodeRestServer } = await import(file);
	NodeRestServer(testData, serverConfigs);
};

const getFile = (file, timeout) => {
	const exists = existsSync(file);
	if (exists) {
		Start(file);
	} else {
		const stopTimer = setInterval(function () {
			const fileExists = existsSync(file);
			if (fileExists) {
				clearInterval(stopTimer);
				Start(file);
			}
		}, timeout);
	}
};

getFile(join(process.cwd(), '/lib/esm/index.js'), 1000);
