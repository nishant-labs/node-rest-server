import { ServerConfiguration, ControllerOptions } from '../types/config.types';

export const extractIfAvailable = (object: ServerConfiguration, attributes: keyof ControllerOptions | Array<keyof ControllerOptions>): ControllerOptions => {
	if (typeof attributes === 'string' && object[attributes]) {
		return { [attributes]: object[attributes] } as ControllerOptions;
	}

	if (Array.isArray(attributes)) {
		return attributes.reduce((result, attribute) => {
			if (object[attribute]) {
				// @ts-ignore
				result[attribute] = object[attribute];
			}
			return result;
		}, {} as ControllerOptions);
	}

	return {} as ControllerOptions;
};
