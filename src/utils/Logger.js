import chalk from 'chalk';
import DateFormat from 'date-fns/format';

const dateTime = () => DateFormat(Date.now(), 'dd-MM-yyyy HH-mm-ss');
const appName = () => '[node-rest-server]';

let isDebug = false;
let isEnabled = true;

const getValue = (value, defaultValue) => (value === undefined ? defaultValue : value);

const getMessage = (type, message) => ({
	appName: appName(),
	level: type.toUpperCase(),
	timestamp: dateTime(),
	message: message.join(' '),
});

const print = (color, type, ...message) => {
	if (isEnabled) {
		const jsonMessage = getMessage(type, message);
		const formattedLog = chalk[color](jsonMessage.appName, '-', jsonMessage.timestamp, '-', jsonMessage.level, '\t-', jsonMessage.message);
		console[type](formattedLog);
	}
};

export const logger = {
	log: (...message) => print('green', 'log', ...message),
	info: (...message) => print('green', 'info', ...message),
	warn: (...message) => print('yellow', 'warn', ...message),
	debug: (...message) => {
		if (isDebug) {
			print('gray', 'debug', ...message);
		}
	},
	error: (...message) => print('red', 'error', ...message),
	trace: (...message) => print('red', 'trace', ...message),
};

export const initializeLogger = ({ logger }) => {
	if (typeof logger === 'boolean') {
		isDebug = false;
		isEnabled = logger;
	} else if (typeof logger === 'object') {
		isDebug = getValue(logger.debug, false);
		isEnabled = getValue(logger.enable, true);
	}
};

/* eslint-enable no-console */
