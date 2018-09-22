export default class RequestHandler {
	static getRequestData(request) {
		return {
			url: `${request.protocol}://${request.hostname}${request.originalUrl}`,
			body: request.body,
			pathParams: request.params,
			queryParams: request.query,
			getHeader: request.get,
			headers: request.headers
		};
	}
}
