import { describe, it, expect } from 'vitest';
import { extractIfAvailable, stringify } from '../../../src/utils/object';
import { ServerConfiguration } from '../../../src/types/config.types';
import { HttpRequest } from '../../../src/types/route.types';
import { ExpressRequest, ExpressResponse } from '../../../src/types/express.types';

describe('extractIfAvailable', () => {
	const serverConfig: ServerConfiguration = {
		getDatabaseConnection: (requestData: HttpRequest, request?: ExpressRequest, response?: ExpressResponse) => Promise.resolve({ requestData, response, request }),
		delay: 5000,
	};

	it('should extract a single attribute if available', () => {
		const result = extractIfAvailable(serverConfig, 'getDatabaseConnection');
		expect(result).toEqual({ getDatabaseConnection: serverConfig.getDatabaseConnection });
	});

	it('should return empty object if single attribute is not available', () => {
		const result = extractIfAvailable(serverConfig, 'nonexistent' as never);
		expect(result).toEqual({});
	});

	it('should extract multiple attributes if available', () => {
		const result = extractIfAvailable(serverConfig, ['getDatabaseConnection', 'delay'] as never);
		expect(result).toEqual({ getDatabaseConnection: serverConfig.getDatabaseConnection, delay: 5000 });
	});

	it('should skip attributes that are not available', () => {
		const result = extractIfAvailable(serverConfig, ['delay', 'missing'] as never);
		expect(result).toEqual({ delay: 5000 });
	});

	it('should return empty object if none of the attributes are available', () => {
		const result = extractIfAvailable(serverConfig, ['foo', 'bar'] as never);
		expect(result).toEqual({});
	});

	it('should return empty object for invalid attributes type', () => {
		const result = extractIfAvailable(serverConfig, 123 as never);
		expect(result).toEqual({});
	});
});

describe('stringify', () => {
	it('should stringify a simple object', () => {
		const obj = { a: 1, b: 'test' };
		expect(stringify(obj)).toBe(JSON.stringify(obj));
	});

	it('should pretty-print when beautify is true', () => {
		const obj = { a: 1, b: 'test' };
		expect(stringify(obj, true)).toBe(JSON.stringify(obj, null, 2));
	});

	it('should handle circular references gracefully', () => {
		const obj: Record<string, unknown> = { a: 1 };
		obj.self = obj;
		const result = stringify(obj);
		expect(result).toContain('[circular object]');
	});

	it('should handle arrays with circular references', () => {
		const arr: unknown[] = [];
		arr.push(arr);
		const result = stringify(arr);
		expect(result).toContain('[circular object]');
	});

	it('should stringify null and undefined correctly', () => {
		expect(stringify(null)).toBe('null');
		expect(stringify(undefined)).toBe(undefined);
	});
});
