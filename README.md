# node-rest-server

[![NPM](https://nodei.co/npm/node-rest-server.png)](https://nodei.co/npm/node-rest-server/)

Configuration only node rest server

Get your own rest based nodejs server within minutes by just providing endpoints and controller.

## Features

- Ready to use rest server in minutes.
- Free from all boilerplate code for creating and managing the server, so that developer can focus on actual business logic.
- Simple configuration to generate response data.

## Where you can use

- Can be used as a stub server for any application(like ReactJS, AngularJS) to mock server response during development.

- Can be used for creating rest micro-service in minutes (help me improve this library)

Do you use for anything else!

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/package/node-rest-server). Install using below command.

```bash
npm install --save node-rest-server
```

## Importing

```js
import NodeRestServer from 'node-rest-server'; // ES6
// or
const NodeRestServer = require('node-rest-server'); // ES5
// or
import { NodeRestServer } from 'node-rest-server'; // If you like to use named export

// call it as function and pass configuration
NodeRestServer(routeConfig, serverConfig);
```

## Usage Example

```js
import NodeRestServer from 'node-rest-server';

const routeConfig = {
	'/api1': {
		method: 'GET',
		status: 200,
		controller: () => 'Data',
	},
};

NodeRestServer(routeConfig);
```

## Sample

[example](./example) directory provides a sample application explaining the use of this library.

## Route Configuration

A route configuration is an object with key(_route path_) value(_route options_) pair:-

1. **Path**: Uri which will serve a resource in rest server
2. **Route Options**: Options which define working of the path and also decide status and response payload.

### Route Options

| Name                | Type               | Default | Description                                                                                                                                                                                                      |
| :------------------ | :----------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| method              | `String`           | `GET`   | Method defines the type of request controller will handle                                                                                                                                                        |
| controller          | `function\|Object` |         | This function/object will contain the business logic for the route path. For a function an object is passed which will contain request `url`, `body`, `params` and `header` and response of `filter` to be used. |
| status (_optional_) | `String`           | `200`   | An appropriate HTTP response status code which server will give response for a request                                                                                                                           |

### Controller method

A controller can either return

- an object with `status` and `payload`;

```js
{
  status: 500, // should be a number
  payload: "Hello world" // user can send any valid json converted using JSON.stringify()
}
```

or

- a response data object (valid as per `JSON.stringify()` json spec)

- a `Promise` which then resolves to return data with above spec

### Route config Example

```js
const routeConfig = {
	'/endpoint1': {
		method: 'GET',
		status: 200,
		controller: () => 'Data',
	},
	'/endpoint2': {
		method: 'POST',
		controller: async (requestData, { getDatabaseConnection }) => {
			const dataFromDB = await getDatabaseConnection();
			return { status: 200, payload: { data: 'Data', dataFromDB } };
		},
	},
	'/endpoint3': [
		{
			method: 'POST',
			controller: async (requestData, { getDatabaseConnection }) => {
				// requestData.method will be POST
				const dataFromDB = await getDatabaseConnection();
				return { status: 200, payload: { data: 'Data', dataFromDB } };
			},
		}, 
		{
			method: 'GET',
			controller: async (requestData) => {
				// requestData.method will be GET 
				return { status: 200, payload: { data: 'Async data' } };
			},
		}
	],
	'/async/endpoint': {
		method: 'POST',
		controller: async (requestData) => {
			// Some DB/api calls
			return { status: 200, payload: { data: 'Async data' } };
		},
	},
};
```

## Server Configuration (_optional_)

This manages how the server will be configured

| Name                  | Type              | Default     | Description                                                                                                                                                                                             |
| :-------------------- | :---------------- | :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| basePath              | `String`          |             | Common prefix for all the routes                                                                                                                                                                        |
| port                  | `Number`          | `8000`      | Port on which server will serve the content                                                                                                                                                             |
| delay (sec)           | `Number`          | `0`         | Forcefully delay the response timing in seconds                                                                                                                                                         |
| logger                | `Object\|Boolean` | `true`      | Enable logging for application, a boolean value will enable/disable all logging features, an object can be passed with property `enable` to toggle the logging and `debug` to enable/disable debug logs |
| getDatabaseConnection | `function`        |             | Provides a mechanism to get DB connection using globally available method passed (supports `Promise`) to controller in second parameter.                                                                |
| filter                | `function`        |             | Enable application level filter and pass returned value(supports `Promise`) to controller.                                                                                                              |
| cors                  | `Object`          | `undefined` | Config should be as per [cors](https://github.com/expressjs/cors) package                                                                                                                               |

### Server config Example

```js
const serverConfig = {
  basePath: '/base/api',
  port: 8080,
  delay: 2,
  logger: {
      enable: true,
      debug: false,
  },
  getDatabaseConnection: async () => {
		return Promise.resolve('db connection');
	}
  filter: (requestData) => {
      return { data: 'calculate' };
  },
  cors: {
    origin: '*'
  },
};
```
