export default class ResponseHandler {
	static getResponseData(requestProcessor, options, responseData) {
		return {
			status: responseData.status || requestProcessor.status || 200,
			data: responseData.payload || responseData
		};
	}
}
