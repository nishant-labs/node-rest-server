/* eslint-disable no-console */

import chalk from 'chalk';
import DateFormat from 'date-fns/format';

const dateTime = () => DateFormat(Date.now(), 'DD-MM-YYYY HH-mm-ss');
const appName = () => '[node-rest-server]';

let isDebug = false;
let isEnabled = true;

const getValue = (value, defaultValue) => (value === undefined ? defaultValue : value);

const getMessage = (type, message) => ({
	appName: appName(),
	level: type.toUpperCase(),
	timestamp: dateTime(),
	message: message.join(' ')
});

const print = (color, type, ...message) => {
	if (isEnabled) {
		const jsonMessage = getMessage(type, message);
		console[type](
			chalk[color](jsonMessage.appName, '-', jsonMessage.timestamp, '-', jsonMessage.level, '\t-', jsonMessage.message)
		);
	}
};

export const logger = {
	info: (...message) => print('green', 'info', ...message),
	warn: (...message) => print('yellow', 'warn', ...message),
	debug: (...message) => {
		if (isDebug) {
			print('gray', 'debug', ...message);
		}
	},
	error: (...message) => print('red', 'error', ...message)
};

export const initializeLogger = loggerConfig => {
	if (typeof loggerConfig === 'boolean') {
		isDebug = false;
		isEnabled = loggerConfig;
	} else if (typeof loggerConfig === 'object') {
		isDebug = getValue(loggerConfig.debug, false);
		isEnabled = getValue(loggerConfig.enable, true);
	}
};

/* eslint-enable no-console */
