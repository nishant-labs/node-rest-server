import { ControllerResponse, RouteConfigItem } from '../types/route.types';

export const extractResponseData = (routeConfig: RouteConfigItem, responseData: ControllerResponse) => {
	const { status, payload, ...userData } = responseData ?? {};
	return {
		status: status || routeConfig.status || 200,
		payload: payload || userData,
	};
};
