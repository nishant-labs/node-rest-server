/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import { beforeAll, describe, it, expect } from 'vitest';
import { spec } from 'pactum';
import { initializeLogger } from '../../src/utils/Logger';
import { registerFilters, registerMiddlewares, registerStatusEndpoint } from '../../src/providers/MiddlewareProvider';

describe('MiddlewareProvider', () => {
	beforeAll(() => {
		initializeLogger({ logger: true });
	});

	it('applies filter data when the filter promise resolves', async () => {
		const app = express();
		registerFilters(app, {
			filter: () => ({ filterValue: 'test-value' }),
		} as never);
		app.get('/filter-success', (_request, response) => {
			response.json(response.locals);
		});

		const server = app.listen(0);
		const port = (server.address() as unknown).port;

		await spec().get(`http://127.0.0.1:${port}/filter-success`).expectStatus(200).expectJson({ filterValue: 'test-value' });

		await new Promise((resolve) => server.close(resolve));
	});

	it('returns 500 when the filter promise rejects', async () => {
		const app = express();
		registerFilters(app, {
			filter: () => Promise.reject(new Error('filter failed')),
		} as any);
		app.get('/filter-error', (_request, response) => {
			response.send('should not reach here');
		});

		const server = app.listen(0);
		const port = (server.address() as any).port;

		await spec().get(`http://127.0.0.1:${port}/filter-error`).expectStatus(500);

		await new Promise((resolve) => server.close(resolve));
	});

	it('registers the status endpoint successfully', () => {
		const app = express();
		registerStatusEndpoint(app);

		const routes = (app as any).router.stack.filter((layer: any) => layer.route).map((layer: never) => layer.route);

		expect(routes.some((route: any) => route.path === '/status' && route.methods.get)).toBe(true);
	});

	it('throws when middleware configuration contains non-function values', () => {
		expect(() => registerMiddlewares(express(), { middlewares: [null] as any } as any)).toThrow('Middleware should be a function');
	});
});
