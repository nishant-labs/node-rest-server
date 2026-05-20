import * as http from 'node:http';
import { Socket } from 'node:net';
import express, { Express } from 'express';
import cors from 'cors';
import { logger } from '../utils/Logger';
import { RestServer, ServerConfiguration, ServerEventListener } from '../types/config.types';

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

const SHUTDOWN_TIMEOUT = 30000; // 30 seconds

export const getServerReturnHandlers = (server?: http.Server): RestServer => ({
	close: (forced?: boolean) =>
		new Promise<Error | undefined>((resolve, reject) => {
			if (!server) {
				reject(new Error('Server instance not found'));
				return;
			}

			let isShutdownComplete = false;
			const openConnections = new Set<http.ServerResponse>();

			const onConnection = (socket: Socket) => {
				socket.setKeepAlive(false);
				if (forced) {
					socket.destroy();
				}
			};

			const onRequest = (_req: http.IncomingMessage, res: http.ServerResponse) => {
				openConnections.add(res);
				res.on('finish', () => {
					openConnections.delete(res);
					if (openConnections.size === 0) {
						logger.debug('All pending requests completed');
					}
				});
			};

			const cleanup = () => {
				if (isShutdownComplete) return;
				isShutdownComplete = true;
				clearTimeout(timeoutHandle);
				server.off('connection', onConnection);
				server.off('request', onRequest);
			};

			const timeoutHandle: NodeJS.Timeout = setTimeout(() => {
				cleanup();
				reject(new Error(`Server shutdown timed out after ${SHUTDOWN_TIMEOUT}ms`));
			}, SHUTDOWN_TIMEOUT);

			const errorHandler = (error: Error) => {
				if (isShutdownComplete) return;
				cleanup();
				reject(error);
			};

			try {
				const serverWithConnectionControl = server as unknown as {
					closeIdleConnections?: () => void;
					closeAllConnections?: () => void;
				};
				if (forced) {
					logger.info('Forcing all connections to close...');
					serverWithConnectionControl.closeIdleConnections?.();
					serverWithConnectionControl.closeAllConnections?.();
				}

				server.on('connection', onConnection);
				server.on('request', onRequest);

				server.close((err) => {
					if (err) {
						errorHandler(err);
						return;
					}
					cleanup();
					resolve(undefined);
				});

				logger.info(`Server shutdown initiated. Mode: ${forced ? 'forced' : 'graceful'}`);
				logger.debug(`Waiting for ${openConnections.size} active connections to complete...`);
			} catch (error) {
				errorHandler(error as Error);
			}
		}),

	addListener: ((event: string, listener: (...args: unknown[]) => void) => {
		if (!server) {
			logger.warn('Cannot add listener: server instance not found');
			return undefined;
		}
		return server.addListener(event, listener);
	}) as ServerEventListener,
});
