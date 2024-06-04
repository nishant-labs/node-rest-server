import RestServer, { RouteConfiguration, ControllerResponse, ControllerFunc } from 'node-rest-server';

interface MyData {
	gender: string;
	name: string;
}

const nameController: typeof ControllerFunc = (requestData) => {
	const { gender, name } = requestData.body as MyData;
	return {
		status: 200,
		payload: {
			name: `Welcome ${gender === 'male' ? 'Mr' : 'Miss'} ${name ? name : 'Anonymous'}`,
			Age: 28,
		},
	};
};

const addressController = () => {
	return { address: 'This Lovely World' };
};

const profileController = async (): Promise<ControllerResponse> => {
	const data = await Promise.resolve({ profile: { name: 'Anonymous', address: 'This Lovely World' } });
	return {
		status: 200,
		payload: data,
		headers: {
			'x-some-header': 'some value',
		},
	};
};

const endpoints: RouteConfiguration = {
	'/name': {
		method: 'POST',
		status: 200,
		controller: nameController,
	},
	'/address': {
		method: 'GET',
		controller: addressController,
	},

	'/profile': {
		method: 'GET',
		controller: profileController,
	},
	'/remove': {
		method: 'DELETE',
		controller: () => {
			return { status: 200 };
		},
	},
};

const serverInstance = RestServer(endpoints);

// Test Server is started and endpoint is working
void fetch('http://localhost:8000/profile')
	.then((res) => res.json())
	.then((data) => {
		console.log('Testing api response: ' + JSON.stringify(data));
	});

// API to manually close server after 10 sec
setTimeout(() => {
	void serverInstance.close().then((error) => {
		console.error(error);
	});
}, 10_000);
