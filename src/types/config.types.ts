import { CorsOptions } from 'cors';
import { ValidationError } from 'fastest-validator';
import { HttpRequest } from './route.types';

export type LoggerLevel = 'log' | 'info' | 'warn' | 'debug' | 'error' | 'trace';
export type LoggerColor = 'green' | 'gray' | 'yellow' | 'red';

export interface LoggerConfiguration {
	enable: boolean;
	debug: boolean;
}

export declare function DatabaseConnectionFunc(requestData: HttpRequest): Promise<unknown>;
export declare function FilterFunc(requestData: HttpRequest): Promise<unknown>;

export interface ControllerOptions {
	getDatabaseConnection?: typeof DatabaseConnectionFunc;
}

export interface ServerConfiguration extends ControllerOptions {
	basePath?: string;
	port?: number;
	delay?: number;
	logger?: boolean | LoggerConfiguration;
	filter?: typeof FilterFunc;
	cors?: CorsOptions;
}

export type ValidatorResponse = true | ValidationError[] | Promise<true | ValidationError[]>;
