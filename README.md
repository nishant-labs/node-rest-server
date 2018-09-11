# node-rest-server

[![NPM](https://nodei.co/npm/node-rest-server.png)](https://nodei.co/npm/node-rest-server/)

Configuration only node rest server

The library will start the express server by just using routes configuration.

## Features

- Ready to use rest server in minutes.
- Free from all boilerplate code for creating and managing the server, so that developer can focus on actual business logic.
- Simple configuration to generate response data.

## Where you can use

- Can be used as a stub server for any application(like ReactJS, AngularJS) to mock server response during development.

- Can be used for creating rest micro-service in minutes (help me improve this library)

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/package/node-rest-server). Install using below command.

```bash
npm install --save node-rest-server
```

## Importing

```js
import RestServer from "node-rest-server"; // ES6
or
var RestServer = require("node-rest-server"); // ES5

// call it as function and pass configuration
RestServer(routeConfig, serverConfig);

```

## Usage Example

```js
import RestServer from "node-rest-server";

const routeConfig = {
    '/api1': {
        method: 'GET',
        status: 200,
        controller: () => 'Data',
    },
};

RestServer(routeConfig);
```

## Sample

[example](./example) directory provides a sample application explaining the use of this library.

## Route Configuration

A route configuration is an object with key(_route path_) value(_route options_) pair:-

1. **Path**: Uri which will serve a resource in rest server
2. **Route Options**: Options which define working of the path and also decide status and response payload.

### Route Options

| Name | Type | Default | Description |
|:---:|:---:|:---:|:---|
| method | `{string}` | `GET` | Method defines the type of request controller will handle |
| controller | `{function\|object}` |  | This function/object will contain the business logic for the route path. For a function an object is passed which will contain request `url`, `body`, `params` and `header` to be used. |
| status (_optional_) | `{string}` | `200` | An appropriate HTTP response status code which server will give response for a request |

### Controller method

A controller can either

- return an object with `status` and `payload`;

```js
{
  status: 500, // should be a number
  payload: "Hello world" // user can send any valid json converted using JSON.stringify()
}
```

or

- return a response data object (valid as per `JSON.stringify()` json spec)

### Example

```js
const routeConfig = {
  '/endpoint1': {
    method: 'GET',
    status: 200,
    controller: () => 'Data',
  },
  '/endpoint2': {
    method: 'POST',
    controller: requestData => {
      return { status: 200, payload: { data: 'Data' } };
    },
  },
}
```

## Server Configuration (_optional_)

This manages how the server will be configured

| Name | Type | Default | Description |
|:---:|:---:|:---:|:---|
| basePath | `{string}` |  | Common prefix for all the routes |
| port | `{Number}` | `8000` | Port on which server will serve the content |
| delay (sec) | `{Number}` | `0` | Forcefully delay the response timing in seconds |

### Example

```js
const serverConfig = {
  basePath: '/base/api',
  port: 8080,
  delay: 2
};
```

## Upcoming features

- Request-response logging
- Better Error handling
- Global Filter
