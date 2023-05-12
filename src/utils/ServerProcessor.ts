import express, { Express } from 'express';
import cors from 'cors';
import { logger } from './Logger';
import { ServerConfiguration } from '../types/config.types';

const configProcessor = (app: Express, serverConfig: ServerConfiguration) => {
	app.set('port', serverConfig.port || 8000);
	app.set('x-powered-by', false);
};

const registerPreprocessor = (app: Express, serverConfig: ServerConfiguration) => {
	logger.debug('loading json processor');
	app.use(express.json());

	logger.debug('loading URL encoder');
	app.use(express.urlencoded({ extended: true }));

	logger.debug('loading cors request handler');
	app.use(cors(serverConfig.cors));
};

export const initPreProcessors = (app: Express, serverConfig: ServerConfiguration) => {
	configProcessor(app, serverConfig);
	registerPreprocessor(app, serverConfig);
};
