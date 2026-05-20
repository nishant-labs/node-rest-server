import { Locals, Request, Response, NextFunction } from 'express';

export type ExpressRequest = Request;
export type ExpressResponse = Response;
export type ExpressNextFunction = NextFunction;

export interface BaseRequest {
	pathParams: ExpressRequest['params'];
	queryParams: ExpressRequest['query'];
	headers: ExpressRequest['headers'];
}

export interface FilterData {
	filter: Locals;
}

export declare function ExpressMiddlewareFunc(request: ExpressRequest, response: ExpressResponse, next: ExpressNextFunction): void;
