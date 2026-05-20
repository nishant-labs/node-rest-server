# node-rest-server

[![NPM](https://nodei.co/npm/node-rest-server.png)](https://nodei.co/npm/node-rest-server/)

A configuration-driven Node.js REST server with Express middleware support and built-in response handling.

> The package ships as an ES module bundle with TypeScript declarations.

## Features

- Configure REST endpoints with minimal boilerplate
- Supports all standard HTTP methods and async controllers
- Built-in response types: `payload`, `error`, `file`, and `html`
- Global request filter with async support
- Per-route Express-compatible middleware support
- Configurable CORS, headers, delay, and HTTPS options
- Graceful and forced server shutdown support
- Fully typed TypeScript exports

## Installation

Install from npm:

```bash
npm install --save node-rest-server
```

Install from GitHub Packages:

```bash
npm install @nishant-labs/node-rest-server
```

## Importing

### ES Modules (recommended)

```js
import NodeRestServer from 'node-rest-server';
import { RouteConfiguration, ServerConfiguration } from 'node-rest-server';
```

### CommonJS

```js
const NodeRestServer = require('node-rest-server');
const { RouteConfiguration, ServerConfiguration } = require('node-rest-server');
```

## Quick Start

```js
import NodeRestServer from 'node-rest-server';

const routeConfig = {
	'/api1': {
		method: 'GET',
		status: 200,
		headers: { 'x-data': 'value' },
		controller: () => ({ payload: 'Data' }),
	},
};

const serverConfig = {
	port: 8080,
};

const server = NodeRestServer(routeConfig, serverConfig);
```

## Server Events

The returned server instance supports Node HTTP event listeners:

- `listening`
- `close`
- `connection`
- `error`
- `request`
- `clientError`

Example:

```js
server.addListener('listening', () => console.log('Server started'));
server.addListener('close', () => console.log('Server shutdown complete'));
```

## Shutdown

The server exposes a `close` method that returns a `Promise<Error | undefined>`:

```ts
await server.close();
await server.close(true);
```

- `close()` performs graceful shutdown and waits for active requests to finish
- `close(true)` forces immediate shutdown and closes open connections

## Route Configuration

A route configuration maps a path to either a single route item or an array of route items for the same path.

### Route item options

|     Name      |                                      Type                                       | Default |                 Description                  |
| :-----------: | :-----------------------------------------------------------------------------: | :-----: | :------------------------------------------: |
|   `method`    | `GET` \| `POST` \| `PUT` \| `DELETE` \| `PATCH` \| `HEAD` \| `OPTIONS` \| `ALL` |  `GET`  |          HTTP method for the route           |
|   `status`    |                                    `number`                                     |  `200`  |          HTTP response status code           |
|   `headers`   |                            `Record<string, string>`                             |    -    |       Response headers for this route        |
| `middlewares` |                         `Array<ExpressMiddlewareFunc>`                          |    -    | Express-compatible middleware for this route |
| `controller`  |                       `Function` \| `Object` \| `Promise`                       |    -    |  Controller response or controller function  |

### Controller signature

A controller receives:

- `requestData`
  - `url`
  - `body`
  - `pathParams`
  - `queryParams`
  - `headers`
  - `method`
  - `rawRequest` (original Express request object)
  - `filter` (data returned from global filter)
- `controllerOptions`
  - `getDatabaseConnection`

Controllers can return:

- an object with `status`, `headers`, and `payload`
- an object with `error`, `file`, or `html`
- plain JSON-serializable data
- a `Promise` resolving to any of the above

Example:

```js
return {
	status: 201,
	headers: { 'x-created': 'true' },
	payload: { message: 'Created' },
};
```

### Example route configuration

```js
const routeConfig = {
	'/endpoint1': {
		method: 'GET',
		status: 200,
		headers: { 'x-data': 'value' },
		controller: () => ({ payload: 'Data' }),
	},
	'/endpoint2': {
		method: 'POST',
		controller: async (requestData, { getDatabaseConnection }) => {
			const connection = await getDatabaseConnection?.(requestData);
			return { status: 200, payload: { data: 'Data', connection } };
		},
	},
	'/endpoint3': [
		{
			method: 'POST',
			controller: async (requestData) => {
				const { rawRequest } = requestData;
				return { status: 200, payload: { data: 'Async data', path: rawRequest.path } };
			},
		},
		{
			method: 'GET',
			controller: (requestData) => ({ status: 200, payload: { filter: requestData.filter } }),
		},
	],
};
```

## Server Configuration

|          Name           |              Type              |            Default            |                             Description                              |
| :---------------------: | :----------------------------: | :---------------------------: | :------------------------------------------------------------------: |
|       `basePath`        |            `string`            |               -               |                     Common prefix for all routes                     |
|         `port`          |            `number`            |            `8000`             |                          Port to listen on                           |
|         `delay`         |            `number`            |              `0`              |                      Delay response by seconds                       |
|        `logger`         |           `boolean`            | `LoggerConfiguration`\|`true` | Enable logging or pass logger settings such as level and output file |
| `getDatabaseConnection` |           `function`           |               -               |                Async helper available in controllers                 |
|        `filter`         |           `function`           |               -               |               Global request filter, supports promises               |
|         `cors`          |         `CorsOptions`          |               -               |              CORS configuration for the `cors` package               |
|        `headers`        |    `Record<string, string>`    |          `function`           |        Global response headers or function returning headers         |
|      `middlewares`      | `Array<ExpressMiddlewareFunc>` |               -               |                     App-level Express middleware                     |
|         `https`         |     `https.ServerOptions`      |               -               |                Enable HTTPS server with Node options                 |

### Example server configuration

```js
const serverConfig = {
	basePath: '/base/api',
	port: 8080,
	delay: 2,
	logger: {
		enable: true,
		level: 'info',
		file: './logs/server.log',
	},
	getDatabaseConnection: async (requestData) => {
		return Promise.resolve('db connection');
	},
	filter: async (requestData) => {
		return { user: 'test-user', requestTime: Date.now() };
	},
	cors: {
		origin: '*',
	},
	headers: (requestData) => ({
		'x-data': 'my header',
		'x-request-method': requestData.method,
	}),
	middlewares: [
		(req, res, next) => {
			console.log('route middleware');
			next();
		},
	],
};
```

## Advanced Response Types

Controller results may include:

- `payload`: sends JSON response
- `error`: sends `{ error }` JSON response
- `file`: sends a file using Express `sendFile`
- `html`: sends raw HTML using Express `send`

## Examples

See the [`examples`](https://github.com/nishant-labs/node-rest-server/tree/main/examples) directory for working samples.
