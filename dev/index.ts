import { existsSync } from 'node:fs';
import { join } from 'node:path';

const getFile = (file: string, timeout: number) => {
	const exists = existsSync(file);
	if (exists) {
		import('./server');
	} else {
		const stopTimer = setInterval(function () {
			const fileExists = existsSync(file);
			if (fileExists) {
				clearInterval(stopTimer);
				import('./server');
			}
		}, timeout);
	}
};

getFile(join(process.cwd(), '/lib/index.mjs'), 1000);
