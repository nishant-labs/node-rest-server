import pino, { BaseLogger, TransportMultiOptions, LoggerOptions } from 'pino';
import { LoggerConfiguration, ServerConfiguration } from '../types/config.types';

export let logger: BaseLogger;

export const initializeLogger = (serverConfig: ServerConfiguration) => {
	const pinoConfig: LoggerOptions = { name: 'node-rest-server', level: 'info' };

	const transportConfig: TransportMultiOptions = { targets: [{ target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:dd-mm-yyyy HH:MM:ss' } }] };

	if (typeof serverConfig.logger === 'boolean') {
		pinoConfig.enabled = serverConfig.logger;
	} else {
		const { name, enable, level, debug, file } = serverConfig.logger as Required<LoggerConfiguration>;

		pinoConfig.name = name ?? pinoConfig.name;
		pinoConfig.enabled = enable;
		pinoConfig.level = level ?? (debug ? 'debug' : 'info');

		if (file) {
			transportConfig.targets = [...transportConfig.targets, { target: 'pino/file', options: { destination: file, mkdir: true } }];
		}
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const transport = pino.transport(transportConfig);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	logger = pino(pinoConfig, transport);
};
