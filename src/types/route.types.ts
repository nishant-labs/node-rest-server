import { ControllerOptions } from './config.types';
import { BaseRequest, ExpressMiddlewareFunc, FilterData } from './express.types';

export type RouteMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

interface Request extends BaseRequest {
	url: string;
	body: unknown;
	getHeader: (name: string) => string | undefined;
	method: Lowercase<RouteMethod> | Uppercase<RouteMethod>;
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
	middlewares?: Array<typeof ExpressMiddlewareFunc>;
	controller: typeof ControllerFunc;
}

export type RouteConfiguration = Record<string, RouteConfigItem | Array<RouteConfigItem>>;
