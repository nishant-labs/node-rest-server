export const hasUniqueMethods = (endpointList = []) =>
	endpointList
		.map((endpointHandler) => endpointHandler.method)
		.filter((method, index, methods) => methods.indexOf(method) === index).length === endpointList.length;
