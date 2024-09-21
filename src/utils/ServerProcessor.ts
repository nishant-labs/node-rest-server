import * as http from 'node:http';
import express, { Express } from 'express';
import cors from 'cors';
import { logger } from './Logger';
import { RestServer, ServerConfiguration } from '../types/config.types';

const configProcessor = (app: Express, serverConfig: ServerConfiguration) => {
	app.set('port', serverConfig.port || 8000);
	app.set('x-powered-by', false);
};

const registerPreprocessor = (app: Express, serverConfig: ServerConfiguration) => {
	logger.debug('loading json processor');
	app.use(express.json());

	logger.debug('loading URL encoder');
	app.use(express.urlencoded({ extended: true }));

	logger.debug('loading cors request handler');
	app.use(cors(serverConfig.cors));
};

export const initPreProcessors = (app: Express, serverConfig: ServerConfiguration) => {
	configProcessor(app, serverConfig);
	registerPreprocessor(app, serverConfig);
};

export const getServerReturnHandlers = (server?: http.Server): RestServer => ({
	close: (forced?: boolean) =>
		new Promise<Error | undefined>((resolve): void => {
			if (!server) {
				resolve(new Error('Server instance not found'));
				return;
			}

			if (forced) {
				server.closeIdleConnections();
				server.closeAllConnections();
			}
			server.close(resolve);
		}),
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addListener: (event: string, listener: (...args: any[]) => void) => {
		if (!server) {
			return;
		}
		return server.addListener(event, listener);
	},
});
