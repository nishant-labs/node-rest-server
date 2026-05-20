/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect } from 'vitest';
import { buildNodeRestServer } from '../../src/buildServer';

describe('buildNodeRestServer', () => {
	it('registers lowercase HTTP methods correctly', () => {
		const app = buildNodeRestServer(
			{
				'/test/hello': {
					method: 'get',
					controller: () => ({ payload: 'Hello' }),
				},
			},
			{ basePath: '/v1/api' },
		);

		const routes = (app as any).router.stack.filter((layer: any) => layer.route).map((layer: any) => layer.route);

		expect(routes.some((route: any) => route.path === '/v1/api/test/hello' && route.methods.get)).toBe(true);
	});

	it('includes the /status endpoint in the built server', () => {
		const app = buildNodeRestServer(
			{
				'/ping': {
					method: 'GET',
					controller: () => ({ payload: 'pong' }),
				},
			},
			{},
		);

		const routes = (app as any).router.stack.filter((layer: any) => layer.route).map((layer: any) => layer.route);

		expect(routes.some((route: any) => route.path === '/status' && route.methods.get)).toBe(true);
	});
});
