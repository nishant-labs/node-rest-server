import { logger } from './Logger';

export const errorHandler = (err) => {
	logger.error(JSON.stringify(err));
};
