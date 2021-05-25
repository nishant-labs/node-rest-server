export const extractIfAvailable = (object, attributes) => {
	if (typeof attributes === 'string' && object[attributes]) return { [attributes]: object[attributes] };
	if (Array.isArray(attributes)) {
		return attributes.reduce((result, attribute) => {
			if (object[attribute]) result[attribute] = object[attribute];
		}, {});
	}
	return;
};
