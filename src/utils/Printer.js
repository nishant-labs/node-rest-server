import chalk from 'chalk';

/*  eslint-disable no-console */
export default {
	yellow: (...message) => print('yellow', ...message),
	red: (...message) => print('red', ...message),
};

const print = (type, ...message) => {
	console.log(chalk[type](...message));
};
/*  eslint-enable no-console */
