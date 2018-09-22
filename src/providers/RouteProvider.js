import { logger } from '../utils/Logger';
import RequestHandler from '../utils/RequestHandler';
import ResponseHandler from '../utils/ResponseHandler';

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
