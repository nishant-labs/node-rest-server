import { CorsOptions } from 'cors';
import { ValidationError } from 'fastest-validator';
import { Request } from './route.types';

export type LoggerLevel = 'log' | 'info' | 'warn' | 'debug' | 'error' | 'trace';
export type LoggerColor = 'green' | 'gray' | 'yellow' | 'red';

export interface LoggerConfiguration {
	enable: boolean;
	debug: boolean;
}

export type DatabaseConnection = (requestData: Request) => unknown | Promise<unknown>;

export interface ControllerOptions {
	getDatabaseConnection?: DatabaseConnection;
}

export interface ServerConfiguration extends ControllerOptions {
	basePath?: string;
	port?: number;
	delay?: number;
	logger?: boolean | LoggerConfiguration;
	filter?: (requestData: Request) => unknown | Promise<unknown>;
	cors?: CorsOptions;
}

export type ValidatorResponse = true | ValidationError[] | Promise<true | ValidationError[]>;
