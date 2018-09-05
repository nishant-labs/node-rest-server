const fs = require('fs');

process.env.NODE_ENV = 'development';

const testData = {
	'/test/data/name': {
		method: 'POST',
		status: 200,
		controller: requestData => {
			const { gender, name } = requestData.body;
			return {
				status: 200,
				payload: {
					name: `Welcome ${gender === 'male' ? 'Mr' : 'Miss'} ${name ? name : 'Anonymous'}`,
					Age: 28
				}
			};
		}
	},
	'/test/data/address': {
		method: 'POST',
		status: 200,
		controller: requestData => {
			return { payload: { place: 'The World' }, requestData };
		}
	},
	'/data/name/:id': {
		method: 'POST',
		controller: requestData => {
			return {
				status: 500,
				payload: { requestData: JSON.stringify(requestData) }
			};
		}
	}
};

const serverConfigs = {
	basePath: '/v2/api',
	port: 8080,
	delay: 2
};

const Start = () => {
	const RestServer = require('./dist').default;
	RestServer(testData, serverConfigs);
};

function getFile(file, timeout) {
	const exists = fs.existsSync(file);
	if (exists) {
		Start();
	} else {
		const stopTimer = setInterval(function() {
			const fileExists = fs.existsSync(file);
			if (fileExists) {
				clearInterval(stopTimer);
				Start();
			}
		}, timeout);
	}
}
getFile('./dist', 1000);
