import { Request as ExpressRequest, Response } from 'express';
import { NodeRestServer } from './NodeRestServer';

export * from './NodeRestServer';
export * from './types/config.types';
export * from './types/route.types';

export { ExpressRequest, Response };

export default NodeRestServer;
