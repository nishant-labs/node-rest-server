import { Request as ExpressRequest, Response } from 'express';
import { GLOBAL_API_ERROR } from '../constants/global';
import { getRequestData, getFilterData } from '../handlers/RequestHandler';
import { publishErrorResponse, sendResponse } from '../handlers/ResponseHandler';
import { errorHandler } from '../utils/ErrorUtils';
import { ControllerResponse, HttpRequest, RouteConfigItem } from '../types/route.types';
import { ServerConfiguration, ControllerOptions } from '../types/config.types';

const buildRequestData = (request: ExpressRequest, response: Response) => ({ ...getRequestData(request), ...getFilterData(response) });

const handleResponseHeaders = (serverConfig: ServerConfiguration, requestData: HttpRequest) => {
	if (serverConfig.headers && typeof serverConfig.headers === 'function') {
		return serverConfig.headers(requestData);
	}
	return serverConfig.headers;
};

const handleControllerResponse = (
	routeConfig: RouteConfigItem,
	controllerOptions: ControllerOptions,
	requestData: HttpRequest,
): ControllerResponse | Promise<ControllerResponse> => {
	if (typeof routeConfig.controller === 'function') {
		return routeConfig.controller(requestData, controllerOptions);
	} else if (typeof routeConfig.controller === 'object') {
		return routeConfig.controller;
	}
	throw new Error('Controller should be either object or a function');
};

export default (routeConfig: RouteConfigItem, controllerOptions: ControllerOptions, serverConfig: ServerConfiguration) => (request: ExpressRequest, response: Response) => {
	try {
		const requestData = buildRequestData(request, response);
		const serverConfigHeaders = handleResponseHeaders(serverConfig, requestData);
		const responseData = handleControllerResponse(routeConfig, controllerOptions, requestData);

		if (responseData instanceof Promise) {
			responseData.then(
				(resolvedResponseData) => {
					sendResponse(routeConfig, serverConfig, response, resolvedResponseData, serverConfigHeaders);
				},
				(error: unknown) => {
					errorHandler(error);
					publishErrorResponse(response, GLOBAL_API_ERROR, (error as Error).message);
				},
			);
			return;
		}
		sendResponse(routeConfig, serverConfig, response, responseData, serverConfigHeaders);
	} catch (error) {
		errorHandler(error);
		publishErrorResponse(response, GLOBAL_API_ERROR, (error as Error).message);
	}
};
