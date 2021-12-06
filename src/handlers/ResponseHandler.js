export default class ResponseHandler {
	static getResponseData(routeConfig, responseData = {}) {
		const { status, payload, ...userData } = responseData;
		return {
			status: status || routeConfig.status || 200,
			data: payload || userData,
		};
	}
}
