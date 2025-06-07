import pino, { BaseLogger, TransportMultiOptions, LoggerOptions } from 'pino';
import { LoggerConfiguration, ServerConfiguration } from '../types/config.types';

export let logger: BaseLogger;

export const initializeLogger = (serverConfig: ServerConfiguration) => {
	const pinoConfig: LoggerOptions = { name: 'node-rest-server', level: 'info' };

	const transportConfig: TransportMultiOptions = { targets: [{ target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:dd-mm-yyyy HH:MM:ss' } }] };

	if (typeof serverConfig.logger === 'boolean') {
		pinoConfig.enabled = serverConfig.logger;
	} else {
		const loggerConfig = serverConfig.logger as LoggerConfiguration;

		pinoConfig.name = loggerConfig.name! ?? pinoConfig.name;
		pinoConfig.enabled = loggerConfig.enable;
		pinoConfig.level = (loggerConfig.level ?? loggerConfig.debug) ? 'debug' : 'info';

		if (loggerConfig.file) {
			transportConfig.targets = [...transportConfig.targets, { target: 'pino/file', options: { destination: loggerConfig.file, mkdir: true } }];
		}
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const transport = pino.transport(transportConfig);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	logger = pino(pinoConfig, transport);
};
