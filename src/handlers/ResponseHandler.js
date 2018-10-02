export default class ResponseHandler {
	static getResponseData(routeConfig, options, responseData = {}) {
		return {
			status: responseData.status || routeConfig.status || 200,
			data: responseData.payload || responseData
		};
	}
}
