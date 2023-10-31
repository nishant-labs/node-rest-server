import { Locals, Request as ExpressRequest } from 'express';
import { ControllerOptions } from './config.types';

export type RouteMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

interface Request {
	url: string;
	body: unknown;
	pathParams: ExpressRequest['params'];
	queryParams: ExpressRequest['query'];
	getHeader: (name: string) => string | undefined;
	headers: ExpressRequest['headers'];
	method: Lowercase<RouteMethod> | Uppercase<RouteMethod>;
}

export interface FilterData {
	filter: Locals;
}

export interface HttpRequest extends Request, Partial<FilterData> {}

export interface ControllerResponse {
	status?: number;
	payload?: unknown;
	headers?: Record<string, string>;
	[key: string]: unknown;
}

export declare function ControllerFunc(requestData: HttpRequest, controllerOptions: ControllerOptions): ControllerResponse | Promise<ControllerResponse>;

export interface RouteConfigItem {
	method: Lowercase<RouteMethod> | Uppercase<RouteMethod>;
	status?: number;
	headers?: Record<string, string>;
	controller: typeof ControllerFunc;
}

export type RouteConfiguration = Record<string, RouteConfigItem | Array<RouteConfigItem>>;
