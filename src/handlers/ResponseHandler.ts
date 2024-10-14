import { Response } from 'express';
import { ServerConfiguration } from '..';
import { logger } from '../utils/Logger';
import { ControllerResponse, RouteConfigItem } from '../types/route.types';

interface FinalResponse {
	status?: number;
	payload?: unknown;
	headers?: Record<string, string>;
}

export const extractResponseData = (routeConfig: RouteConfigItem, controllerResponseData: ControllerResponse = {}, serverConfigHeaders?: Record<string, string>): FinalResponse => {
	const { status, payload, headers, ...userData } = controllerResponseData;
	return {
		status: status || routeConfig.status || 200,
		payload: payload || userData,
		headers: { ...serverConfigHeaders, ...routeConfig.headers, ...headers },
	};
};

export const publishErrorResponse = (response: Response, status: number, payload: string) => {
	publishResponse(response, { status, payload, headers: {} });
};

const publishResponse = (response: Response, finalResponse: FinalResponse) => {
	const { status, payload, headers } = finalResponse;
	if (headers && Object.keys(headers).length !== 0) {
		response.set(headers);
	}

	if (status) {
		response.status(status);
	}

	if (payload && Object.keys(payload).length !== 0) {
		response.json(payload);
	} else {
		response.end();
	}
};

export const sendResponse = (
	routeConfig: RouteConfigItem,
	serverConfig: ServerConfiguration,
	response: Response,
	controllerResponseData: ControllerResponse,
	serverConfigHeaders?: Record<string, string>,
) => {
	const finalResponse = extractResponseData(routeConfig, controllerResponseData, serverConfigHeaders);
	logger.debug('Response sent : ', finalResponse.payload);
	if (serverConfig.delay && serverConfig.delay > 0) {
		setTimeout(() => {
			publishResponse(response, finalResponse);
		}, serverConfig.delay * 1000);
	} else {
		publishResponse(response, finalResponse);
	}
};
