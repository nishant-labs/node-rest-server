import { Request as ExpressRequest, Response } from 'express';
import { extractIfAvailable } from '../utils/object';
import { ControllerOptions, ServerConfiguration } from '../types/config.types';
import { FilterData, Request, RouteMethod } from '../types/route.types';

export const getRequestData = (request: ExpressRequest): Request => ({
	url: `${request.protocol}://${request.hostname}${request.originalUrl}`,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	body: request.body,
	pathParams: request.params,
	queryParams: request.query,
	getHeader: (name: string) => request.get(name),
	headers: request.headers,
	method: request.method as RouteMethod,
});

export const getFilterData = (response: Response): FilterData => ({
	filter: response.locals,
});

export const getControllerOptions = (options: ServerConfiguration): ControllerOptions => {
	return extractIfAvailable(options, 'getDatabaseConnection');
};
