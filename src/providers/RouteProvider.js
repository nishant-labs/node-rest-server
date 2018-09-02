import RequestHandler from '../utils/RequestHandler';
import ResponseHandler from '../utils/ResponseHandler';

export default (requestProcessor, options) => (request, response) => {
	const responseData = requestProcessor.payload(RequestHandler.getRequestDataForPayload(request));
	const { status, data } = ResponseHandler.getResponseData(requestProcessor, options, responseData);
	if (options.delay > 0) {
		setTimeout(() => {
			response.status(status).json(data);
		}, options.delay * 1000);
	} else {
		response.status(status).json(data);
	}
};
