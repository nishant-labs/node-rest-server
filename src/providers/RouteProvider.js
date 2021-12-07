import { logger } from '../utils/Logger';
import { GLOBAL_API_ERROR } from '../constants/global';
import { getRequestData, getFilterData } from '../handlers/RequestHandler';
import ResponseHandler from '../handlers/ResponseHandler';
import { errorHandler } from '../utils/ErrorUtils';

const publishResponse = (response, status, data) => {
	if (status && data && Object.keys(data).length !== 0) {
		response.status(status).json(data);
	} else if (status && (!data || Object.keys(data).length === 0)) {
		response.status(status).end();
	} else {
		response.end();
	}
};

const sendResponse = (routeConfig, responseData, response, serverConfig) => {
	const { status, data } = ResponseHandler.getResponseData(routeConfig, responseData, serverConfig);
	logger.info('Response sent : ', JSON.stringify(data));
	if (serverConfig.delay > 0) {
		setTimeout(() => {
			publishResponse(response, status, data);
		}, serverConfig.delay * 1000);
	} else {
		publishResponse(response, status, data);
	}
};

const handleControllerResponse = (routeConfig, request, response, controllerOptions) => {
	if (typeof routeConfig.controller === 'function') {
		const requestData = { ...getRequestData(request), ...getFilterData(response) };
		return routeConfig.controller(requestData, controllerOptions);
	} else if (typeof routeConfig.controller === 'object') {
		return routeConfig.controller;
	}
	return;
};

export default (routeConfig, controllerOptions, serverConfig) => (request, response) => {
	try {
		const responseData = handleControllerResponse(routeConfig, request, response, controllerOptions);
		if (responseData instanceof Promise) {
			responseData.then(
				(data) => {
					sendResponse(routeConfig, data, response, serverConfig);
				},
				(error) => {
					errorHandler(error);
					publishResponse(response, GLOBAL_API_ERROR, error.message);
				},
			);
			return;
		}
		sendResponse(routeConfig, responseData, response, serverConfig);
	} catch (error) {
		errorHandler(error);
		publishResponse(response, GLOBAL_API_ERROR, error.message);
	}
};
