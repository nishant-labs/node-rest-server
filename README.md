# node-rest-server

Configuration only node rest server

The application will start express server by just passing routes configuration and controller will provide response.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/). Install using below command.

```bash
npm install node-rest-server
```

## Features

Ready to use with easy configuration node server, so that developer can focus on actual business logic.

## How to use

```js
import RestServer from "node-rest-server";

RestServer(routeConfig, serverConfig);
```

## Route Configuration

The configuration is an object with 2 properties:-

1. **Path**: Uri which will serve a resource in rest server
2. **Route Options**: Different options which define working of the path and also decide status and response payload.

### Route Options

| Name | Type | Default | Description |
|:---:|:---:|:---:|:---|
| method | `{string}` | `GET` | Method defines the type of request controller will handle |
| controller | `{function\|object}` |  | This function/object will contain the business logic for the route path. For function an object is passed which will contain request `url`, `body`, `params` and `header` to be used. |
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
      return { status: 200, payload: { data: 'Data' }};
    },
  },
}
```

## Server Configuration (_optional_)

This manages how server will be configured

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