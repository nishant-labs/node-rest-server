import RestServer, { HttpRequest, RouteConfiguration } from 'node-rest-server';

interface MyData {
	gender: string;
	name: string;
}

const nameController = (requestData: HttpRequest) => {
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

const profileController = async () => {
	const data = await Promise.resolve({ profile: { name: 'Anonymous', address: 'This Lovely World' } });
	return {
		status: 200,
		payload: data,
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

RestServer(endpoints);
