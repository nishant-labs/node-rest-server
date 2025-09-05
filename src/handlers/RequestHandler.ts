import { extractIfAvailable } from '../utils/object';
import { ControllerOptions, ServerConfiguration } from '../types/config.types';
import { HttpRequest, RouteMethod } from '../types/route.types';
import { ExpressRequest, ExpressResponse, FilterData } from '../types/express.types';

export const getRequestData = (request: ExpressRequest): HttpRequest => ({
	url: `${request.protocol}://${request.hostname}${request.originalUrl}`,
	body: request.body,
	pathParams: request.params,
	queryParams: request.query,
	getHeader: (name: string) => request.get(name),
	headers: request.headers,
	method: request.method as RouteMethod,
	rawRequest: request,
});

export const getFilterData = (response: ExpressResponse): FilterData => ({
	filter: response.locals,
});

export const getControllerOptions = (options: ServerConfiguration): ControllerOptions => {
	return extractIfAvailable(options, 'getDatabaseConnection');
};
