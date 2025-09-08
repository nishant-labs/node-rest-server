import NodeRestServer, { RestServer, ServerConfiguration } from '../lib/index.mjs';
import { allRoutes } from '../test/integration/samples/test-routes';

let server: RestServer;

const serverConfig: ServerConfiguration = {
	basePath: '/v1/api',
	port: 8080,
};

export const setup = () => {
	server = NodeRestServer(allRoutes, serverConfig);
};

export const teardown = async () => {
	await server?.close();
};
