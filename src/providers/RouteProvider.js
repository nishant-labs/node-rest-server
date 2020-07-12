import { logger } from '../utils/Logger';
import RequestHandler from '../handlers/RequestHandler';
import ResponseHandler from '../handlers/ResponseHandler';

const sendResponse = (routeConfig, options, responseData, response) => {
	const { status, data } = ResponseHandler.getResponseData(routeConfig, options, responseData);

	logger.info('Response sent : ', JSON.stringify(data));
	if (options.delay > 0) {
		setTimeout(() => {
			response.status(status).json(data);
		}, options.delay * 1000);
	} else {
		response.status(status).json(data);
	}
};

export default (routeConfig, options) => (request, response) => {
	let responseData;
	try {
		if (typeof routeConfig.controller === 'function') {
			responseData = routeConfig.controller({ ...RequestHandler.getRequestData(request), ...response.locals });
		} else if (typeof routeConfig.controller === 'object') {
			responseData = routeConfig.controller;
		}
	} catch (error) {
		logger.error(JSON.stringify(error));
	}

	// Handle case where controller returns a promise (such as for an async function)
	if (responseData instanceof Promise) {
		responseData.then((data) => {
			sendResponse(routeConfig, options, data, response);
		}, (err) => {
			logger.error(JSON.stringify(err));
		});

		return;
	}

	sendResponse(routeConfig, options, responseData, response);
};
