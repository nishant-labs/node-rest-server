import { Request as ExpressRequest, Response } from 'express';
import { logger } from '../utils/Logger';
import { GLOBAL_API_ERROR } from '../constants/global';
import { getRequestData, getFilterData } from '../handlers/RequestHandler';
import { extractResponseData } from '../handlers/ResponseHandler';
import { errorHandler } from '../utils/ErrorUtils';
import { ControllerResponse, RouteConfigItem } from '../types/route.types';
import { ServerConfiguration, ControllerOptions } from '../types/config.types';

const publishResponse = (response: Response, status?: number, payload?: unknown) => {
	if (status && payload && Object.keys(payload).length !== 0) {
		response.status(status).json(payload);
	} else if (status && (!payload || Object.keys(payload).length === 0)) {
		response.status(status).end();
	} else {
		response.end();
	}
};

const sendResponse = (routeConfig: RouteConfigItem, responseData: ControllerResponse, response: Response, serverConfig: ServerConfiguration) => {
	const { status, payload } = extractResponseData(routeConfig, responseData);
	logger.debug('Response sent : ', JSON.stringify(payload));
	if (serverConfig.delay && serverConfig.delay > 0) {
		setTimeout(() => {
			publishResponse(response, status, payload);
		}, serverConfig.delay * 1000);
	} else {
		publishResponse(response, status, payload);
	}
};

const handleControllerResponse = (
	routeConfig: RouteConfigItem,
	request: ExpressRequest,
	response: Response,
	controllerOptions: ControllerOptions,
): ControllerResponse | Promise<ControllerResponse> => {
	if (typeof routeConfig.controller === 'function') {
		const requestData = { ...getRequestData(request), ...getFilterData(response) };
		return routeConfig.controller(requestData, controllerOptions);
	} else if (typeof routeConfig.controller === 'object') {
		return routeConfig.controller;
	}
	throw new Error('Controller should be either object or a function');
};

export default (routeConfig: RouteConfigItem, controllerOptions: ControllerOptions, serverConfig: ServerConfiguration) => (request: ExpressRequest, response: Response) => {
	try {
		const responseData = handleControllerResponse(routeConfig, request, response, controllerOptions);
		if (responseData instanceof Promise) {
			responseData.then(
				(data) => {
					sendResponse(routeConfig, data, response, serverConfig);
				},
				(error: Error) => {
					errorHandler(error);
					publishResponse(response, GLOBAL_API_ERROR, error.message);
				},
			);
			return;
		}
		sendResponse(routeConfig, responseData, response, serverConfig);
	} catch (error: unknown) {
		errorHandler(error);
		publishResponse(response, GLOBAL_API_ERROR, (error as Error).message);
	}
};
