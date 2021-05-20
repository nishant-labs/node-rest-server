const fs = require('fs');
const path = require('path');

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
	'/data/name/:id': {
		method: 'POST',
		controller: (requestData) => {
			return {
				status: 500,
				payload: { requestData: JSON.stringify(requestData) },
			};
		},
	},
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

const Start = () => {
	const NodeRestServer = require('../lib');
	NodeRestServer(testData, serverConfigs);
};

const getFile = (file, timeout) => {
	const exists = fs.existsSync(file);
	if (exists) {
		Start();
	} else {
		const stopTimer = setInterval(function () {
			const fileExists = fs.existsSync(file);
			if (fileExists) {
				clearInterval(stopTimer);
				Start();
			}
		}, timeout);
	}
};

getFile(path.join(__dirname, '../lib/index.js'), 1000);
