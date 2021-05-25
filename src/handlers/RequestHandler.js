import { extractIfAvailable } from '../utils/object';

export const getRequestData = (request) => ({
	url: `${request.protocol}://${request.hostname}${request.originalUrl}`,
	body: request.body,
	pathParams: request.params,
	queryParams: request.query,
	getHeader: request.get,
	headers: request.headers,
});

export const getFilterData = (response) => ({
	filter: response.locals,
});

export const getControllerOptions = (options) => {
	const sanitisedOptions = extractIfAvailable(options, 'getDatabaseConnection');
	return sanitisedOptions || {};
};
