import { Locals, Request as ExpressRequest } from 'express';
import { ControllerOptions } from './config.types';

export type RouteMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export interface Request {
	url: string;
	body: ExpressRequest['body'];
	pathParams: ExpressRequest['params'];
	queryParams: ExpressRequest['query'];
	getHeader: (name: string) => string | undefined;
	headers: ExpressRequest['headers'];
	method: Lowercase<RouteMethod> | Uppercase<RouteMethod>;
}

export interface FilterData {
	filter: Locals;
}

export interface HttpRequest extends Request, FilterData {}

export interface ControllerResponse {
	status?: number;
	payload?: unknown;
	[key: string]: unknown;
}

export interface RouteConfigItem {
	method: Lowercase<RouteMethod> | Uppercase<RouteMethod>;
	status?: number;
	controller: ((requestData: HttpRequest, controllerOptions: ControllerOptions) => ControllerResponse | Promise<ControllerResponse>) | ControllerResponse;
}

export type RouteConfiguration = Record<string, RouteConfigItem | Array<RouteConfigItem>>;
