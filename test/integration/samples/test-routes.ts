import { RouteConfiguration } from '../../../lib';

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
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					name: `Welcome ${requestData.body.name ?? 'Anonymous'}`,
					Age: 28,
				},
			};
		},
	},
};
