import { startVitest } from 'vitest/node';
import NodeRestServer, { ServerConfiguration } from '../../lib/index.mjs';
import { allRoutes } from '../../test/samples/test-routes';

const serverConfig: ServerConfiguration = {
	basePath: '/v1/api',
	port: 8080,
};

const server = NodeRestServer(allRoutes, serverConfig);
const vitest = await startVitest('test');

await vitest?.close().finally(() => {
	server.close();
});
