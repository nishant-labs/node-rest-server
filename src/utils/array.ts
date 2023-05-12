import { RouteConfigItem } from '../types/route.types';

export const hasUniqueMethods = (endpointList: RouteConfigItem[] = []) =>
	endpointList.map((endpointHandler) => endpointHandler.method).filter((method, index, methods) => methods.indexOf(method) === index).length === endpointList.length;
