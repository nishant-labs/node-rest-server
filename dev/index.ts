import { existsSync } from 'node:fs';
import { join } from 'node:path';

const getFile = async (file: string, timeout: number) => {
	const exists = existsSync(file);
	if (exists) {
		await import('./server');
	} else {
		const stopTimer = setInterval(() => {
			const fileExists = existsSync(file);
			if (fileExists) {
				clearInterval(stopTimer);
				void (async () => {
					await import('./server');
				})();
			}
		}, timeout);
	}
};

await getFile(join(process.cwd(), '/lib/index.mjs'), 1000);
