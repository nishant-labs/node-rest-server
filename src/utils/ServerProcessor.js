import express from 'express';
import cors from 'cors';
import { logger } from '../utils/Logger';

const configProcessor = (app, serverConfig) => {
	app.set('port', serverConfig.port || 8000);
	app.set('x-powered-by', false);
};

const registerPreprocessor = (app, serverConfig) => {
	logger.debug('loading json processor');
	app.use(express.json());

	logger.debug('loading URL encoder');
	app.use(express.urlencoded({ extended: true }));

	logger.debug('loading cors request handler');
	app.use(cors(serverConfig.cors));
};

export const initPreProcessors = (app, serverConfig) => {
	configProcessor(app, serverConfig);
	registerPreprocessor(app, serverConfig);
};
