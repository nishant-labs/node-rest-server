const RestServer = require('node-rest-server').default;

const nameController = (requestData) => {
	const { gender, name } = requestData.body;
	return {
		status: 200,
		payload: {
			name: `Welcome ${gender === 'male' ? 'Mr' : 'Miss'} ${name ? name : 'Anonymous'}`,
			Age: 28
		}
	};
}

const addressController = () => {
	return { address: 'This Lovely World' };
}

const endpoints = {
	'/name': {
		method: 'POST',
		status: 200,
		controller: nameController,
	},
	'/address': {
		method: 'GET',
		controller: addressController,
	},
};

RestServer(endpoints);