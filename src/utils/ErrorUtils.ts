import { logger } from './Logger';

export const errorHandler = (err: unknown) => {
	logger.error(err);
};
