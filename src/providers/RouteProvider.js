import RequestHandler from '../utils/RequestHandler';
import ResponseHandler from '../utils/ResponseHandler';

export default (routeConfig, options) => (request, response) => {
	let responseData;
	if (typeof routeConfig.controller === 'function') {
		responseData = routeConfig.controller(RequestHandler.getRequestDataForPayload(request));	
	} else if (typeof routeConfig.controller === 'object') {
		responseData = routeConfig.controller;
	}
	const { status, data } = ResponseHandler.getResponseData(routeConfig, options, responseData);
	if (options.delay > 0) {
		setTimeout(() => {
			response.status(status).json(data);
		}, options.delay * 1000);
	} else {
		response.status(status).json(data);
	}
};
