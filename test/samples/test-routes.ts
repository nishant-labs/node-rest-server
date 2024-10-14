import { RouteConfiguration } from '../../lib/index.mjs';

export const allRoutes: RouteConfiguration = {
	'/test/hello': {
		method: 'GET',
		status: 200,
		controller: () => ({
			payload: 'Hello World',
		}),
	},
	'/test/data/name': {
		method: 'POST',
		status: 200,
		controller: (requestData) => {
			return {
				status: 200,
				payload: {
					name: `Welcome ${(requestData.body as any).name ?? 'Anonymous'}`,
					Age: 28,
				},
			};
		},
	},
};
