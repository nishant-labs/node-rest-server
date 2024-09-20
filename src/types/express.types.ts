import { Locals, Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';

export interface BaseRequest {
	pathParams: ExpressRequest['params'];
	queryParams: ExpressRequest['query'];
	headers: ExpressRequest['headers'];
}

export interface FilterData {
	filter: Locals;
}

export declare function ExpressMiddlewareFunc(request: ExpressRequest, response: ExpressResponse, next: ExpressNextFunction): void;
