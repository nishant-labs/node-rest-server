import { IncomingMessage, RequestListener, Server } from 'node:http';
import { ServerOptions } from 'node:https';
import { Socket } from 'node:net';
import { Duplex } from 'node:stream';
import { CorsOptions } from 'cors';
import { LevelWithSilentOrString } from 'pino';
import { HttpRequest } from './route.types';
import { ExpressMiddlewareFunc, ExpressRequest, ExpressResponse } from './express.types';

export type HttpServerInstance = Server | undefined;

/**
 * Server event listener types for type safety
 */
export type ServerEventListener = {
	(event: 'close' | 'listening', listener: () => void): HttpServerInstance;
	(event: 'connect' | 'upgrade', listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void): HttpServerInstance;
	(event: 'checkContinue' | 'checkExpectation' | 'request', listener: RequestListener): HttpServerInstance;
	(event: 'connection', listener: (socket: Socket) => void): HttpServerInstance;
	(event: 'dropRequest', listener: (req: IncomingMessage, socket: Duplex) => void): HttpServerInstance;
	(event: 'clientError', listener: (err: Error, socket: Duplex) => void): HttpServerInstance;
	(event: 'error', listener: (err: Error) => void): HttpServerInstance;
};

export interface LoggerConfiguration {
	enable: boolean;
	name?: string;
	level?: LevelWithSilentOrString;

	/**
	 * @deprecated The "debug" property is deprecated. Use "level" instead.
	 */
	debug?: boolean;
	file?: string;
}

export declare function DatabaseConnectionFunc(requestData: HttpRequest, request?: ExpressRequest, response?: ExpressResponse): Promise<unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function FilterFunc(requestData: HttpRequest, request?: ExpressRequest, response?: ExpressResponse): Promise<Record<string, any>>;
export declare function HeaderFunc(requestData: HttpRequest, request?: ExpressRequest, response?: ExpressResponse): Record<string, string>;

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
