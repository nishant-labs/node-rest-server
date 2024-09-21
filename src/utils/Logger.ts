import chalk from 'chalk';
import { format } from 'date-fns';
import { LoggerColor, LoggerLevel, ServerConfiguration } from '../types/config.types';

const dateTime = () => format(Date.now(), 'dd-MM-yyyy HH-mm-ss');
const appName = () => '[node-rest-server]';

let isDebug = false;
let isEnabled = true;

const getValue = (value?: boolean, defaultValue = false): boolean => (value === undefined ? defaultValue : value);

const getMessage = (type: LoggerLevel, message: Array<unknown>) => ({
	appName: appName(),
	level: type.toUpperCase(),
	timestamp: dateTime(),
	userMessage: message.join(' '),
});

const print = (color: LoggerColor, type: LoggerLevel, ...message: Array<unknown>) => {
	if (isEnabled) {
		const { appName, level, timestamp, userMessage } = getMessage(type, message);
		const formattedLog = chalk[color](appName, '-', timestamp, '-', level.padEnd(5), '-', userMessage);
		console[type](formattedLog);
	}
};

export const logger = {
	log: (...message: Array<unknown>) => {
		print('green', 'log', ...message);
	},
	info: (...message: Array<unknown>) => {
		print('green', 'info', ...message);
	},
	warn: (...message: Array<unknown>) => {
		print('yellow', 'warn', ...message);
	},
	debug: (...message: Array<unknown>) => {
		if (isDebug) {
			print('gray', 'debug', ...message);
		}
	},
	error: (...message: Array<unknown>) => {
		print('red', 'error', ...message);
	},
	trace: (...message: Array<unknown>) => {
		print('red', 'trace', ...message);
	},
};

export const initializeLogger = ({ logger }: ServerConfiguration) => {
	if (typeof logger === 'boolean') {
		isDebug = false;
		isEnabled = logger;
	} else if (typeof logger === 'object') {
		isDebug = getValue(logger.debug, false);
		isEnabled = getValue(logger.enable, true);
	}
};
