import express from 'express';
import { logger } from '../utils/Logger';

const configProcessor = (app, serverConfig) => {
	app.set('port', serverConfig.port || 8000);
};

const registerPreprocessor = app => {
	logger.debug('loading json processor');
	app.use(express.json());
	logger.debug('loading URL encoder');
	app.use(express.urlencoded({ extended: true }));
};

export const initPreProcessors = (app, serverConfig) => {
	configProcessor(app, serverConfig);
	registerPreprocessor(app);
};
