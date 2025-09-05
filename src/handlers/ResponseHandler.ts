import { ServerConfiguration } from '../types/config.types';
import { logger } from '../utils/Logger';
import { ControllerResponse, RouteConfigItem } from '../types/route.types';
import { ExpressResponse } from '../types/express.types';
import { FinalResponse } from '../types/response.types';

export const extractResponseData = (
	routeConfig: RouteConfigItem,
	controllerResponseData: ControllerResponse = {},
	serverConfigHeaders?: Record<string, string>,
): Partial<FinalResponse> => {
	const { status, headers, ...userData } = controllerResponseData;
	return {
		...userData,
		status: status || routeConfig.status || 200,
		headers: { ...serverConfigHeaders, ...routeConfig.headers, ...headers },
	};
};

export const publishErrorResponse = (response: ExpressResponse, status: number, payload: string) => {
	publishResponse(response, { status, payload, headers: {} });
};

const publishResponse = (response: ExpressResponse, finalResponse: Partial<FinalResponse>) => {
	const { status, headers } = finalResponse;
	if (headers && Object.keys(headers).length !== 0) {
		response.header(headers);
	}

	if (status) {
		response.status(status);
	}

	const hasPayload = 'payload' in finalResponse;
	const hasFile = 'file' in finalResponse;
	const hasHtml = 'html' in finalResponse;

	if (hasPayload && finalResponse.payload) {
		logger.debug(`Response sent : ${JSON.stringify(finalResponse.payload)}`);
		response.json(finalResponse.payload);
	} else if (hasFile && finalResponse.file) {
		logger.debug(`Response sent : ${finalResponse.file}`);
		response.sendFile(finalResponse.file);
	} else if (hasHtml && finalResponse.html) {
		logger.debug(`Response sent : ${finalResponse.html}`);
		response.send(finalResponse.html);
	} else {
		response.end();
	}
};

export const sendResponse = (
	routeConfig: RouteConfigItem,
	serverConfig: ServerConfiguration,
	response: ExpressResponse,
	controllerResponseData: ControllerResponse,
	serverConfigHeaders?: Record<string, string>,
) => {
	const finalResponse = extractResponseData(routeConfig, controllerResponseData, serverConfigHeaders);
	if (serverConfig.delay && serverConfig.delay > 0) {
		setTimeout(() => {
			publishResponse(response, finalResponse);
		}, serverConfig.delay * 1000);
	} else {
		publishResponse(response, finalResponse);
	}
};
