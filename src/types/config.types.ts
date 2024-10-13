import { IncomingMessage, RequestListener, Server } from 'node:http';
import { ServerOptions } from 'node:https';
import { Socket } from 'node:net';
import { Duplex } from 'node:stream';
import { CorsOptions } from 'cors';
import { HttpRequest } from './route.types';
import { ExpressMiddlewareFunc } from './express.types';

export type LoggerLevel = 'log' | 'info' | 'warn' | 'debug' | 'error' | 'trace';
export type LoggerColor = 'green' | 'gray' | 'yellow' | 'red';
type HttpServerInstance = Server | undefined;

export interface LoggerConfiguration {
	enable: boolean;
	debug?: boolean;
	beautifyJSON?: boolean;
}

export declare function DatabaseConnectionFunc(requestData: HttpRequest): Promise<unknown>;
export declare function FilterFunc(requestData: HttpRequest): Promise<unknown>;
export declare function HeaderFunc(requestData: HttpRequest): Record<string, string>;

export interface ControllerOptions {
	getDatabaseConnection?: typeof DatabaseConnectionFunc;
}

export interface ServerConfiguration extends ControllerOptions {
	basePath?: string;
	port?: number;
	headers?: Record<string, string> | typeof HeaderFunc;
	delay?: number;
	logger?: boolean | LoggerConfiguration;
	filter?: typeof FilterFunc;
	cors?: CorsOptions;
	https?: ServerOptions;
	middlewares?: Array<typeof ExpressMiddlewareFunc>;
}

export interface RestServer {
	close: (forced?: boolean) => Promise<Error | undefined>;

	// Extracted from node HTTP module
	addListener(event: string, listener: (...args: unknown[]) => void): HttpServerInstance;

	addListener(event: 'close' | 'listening', listener: () => void): HttpServerInstance;
	addListener(event: 'connect' | 'upgrade', listener: (req: InstanceType<typeof IncomingMessage>, socket: Duplex, head: Buffer) => void): HttpServerInstance;
	addListener(event: 'checkContinue' | 'checkExpectation' | 'request', listener: RequestListener): HttpServerInstance;

	addListener(event: 'connection', listener: (socket: Socket) => void): HttpServerInstance;
	addListener(event: 'dropRequest', listener: (req: InstanceType<typeof IncomingMessage>, socket: Duplex) => void): HttpServerInstance;
	addListener(event: 'clientError', listener: (err: Error, socket: Duplex) => void): HttpServerInstance;
	addListener(event: 'error', listener: (err: Error) => void): HttpServerInstance;
}
