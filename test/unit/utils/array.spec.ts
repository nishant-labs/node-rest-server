import { describe, it, expect } from 'vitest';
import { hasUniqueMethods } from '../../../src/utils/array';
import { RouteConfigItem } from '../../../src/types/route.types';

const endpoints: Array<RouteConfigItem> = [
	{
		method: 'GET',
		controller: () => ({}),
	},
	{
		method: 'POST',
		controller: () => ({}),
	},
	{
		method: 'PUT',
		controller: () => ({}),
	},
];

describe('hasUniqueMethods', () => {
	it('returns true for empty array', () => {
		expect(hasUniqueMethods([])).toBe(true);
		expect(hasUniqueMethods()).toBe(true);
	});

	it('returns true when all methods are unique', () => {
		expect(hasUniqueMethods(endpoints)).toBe(true);
	});

	it('returns false when methods are not unique', () => {
		const withDuplicateMethods: Array<RouteConfigItem> = [...endpoints, { method: 'GET', controller: () => ({}) }];
		expect(hasUniqueMethods(withDuplicateMethods)).toBe(false);
	});

	it('returns true for single endpoint', () => {
		const singleEndpoint: Array<RouteConfigItem> = [endpoints[0]];
		expect(hasUniqueMethods(singleEndpoint)).toBe(true);
	});

	it('handles mixed case methods as different', () => {
		const withDuplicateMethods: Array<RouteConfigItem> = [...endpoints, { method: 'get', controller: () => ({}) }];
		expect(hasUniqueMethods(withDuplicateMethods)).toBe(true);
	});
});
