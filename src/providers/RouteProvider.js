import { logger } from '../utils/Logger';
import { GLOBAL_API_ERROR } from '../constants/global';
import { getRequestData, getFilterData } from '../handlers/RequestHandler';
import ResponseHandler from '../handlers/ResponseHandler';
import { errorHandler } from '../utils/ErrorUtils';

const sendResponse = (routeConfig, responseData, response, options) => {
	const { status, data } = ResponseHandler.getResponseData(routeConfig, responseData, options);
	logger.info('Response sent : ', JSON.stringify(data));
	if (options.delay > 0) {
		setTimeout(() => {
			response.status(status).json(data);
		}, options.delay * 1000);
	} else {
		response.status(status).json(data);
	}
};

const handleControllerResponse = (routeConfig, request, response) => {
	if (typeof routeConfig.controller === 'function') {
		return routeConfig.controller({ ...getRequestData(request), ...getFilterData(response) });
	} else if (typeof routeConfig.controller === 'object') {
		return routeConfig.controller;
	}
	return;
};

export default (routeConfig, options) => (request, response) => {
	try {
		const responseData = handleControllerResponse(routeConfig, request, response, options);
		if (responseData instanceof Promise) {
			responseData.then(
				(data) => {
					sendResponse(routeConfig, data, response, options);
				},
				(error) => {
					errorHandler(error);
					response.status(GLOBAL_API_ERROR).json(error.message);
				},
			);
			return;
		}
		sendResponse(routeConfig, responseData, response, options);
	} catch (error) {
		errorHandler(error);
		response.status(GLOBAL_API_ERROR).json(error.message);
	}
};
