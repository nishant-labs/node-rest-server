import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { logger, initializeLogger } from '../../../src/utils/Logger';

const mockPino = {
	info: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	debug: vi.fn(),
};

vi.mock('pino', async () => {
	const actualPino = await vi.importActual('pino');
	const pinoConstructor = vi.fn(() => mockPino);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	pinoConstructor.transport = vi.fn();
	return {
		...actualPino,
		default: pinoConstructor,
	};
});

describe('logger utility', () => {
	beforeAll(() => {
		initializeLogger({ logger: true });
	});

	beforeEach(() => {
		mockPino.error.mockClear();
		mockPino.info.mockClear();
		mockPino.warn.mockClear();
		mockPino.debug.mockClear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should log info messages', () => {
		logger.info('test info');
		expect(mockPino.info).toHaveBeenCalledWith('test info');
	});

	it('should log error messages', () => {
		logger.error('test error');
		expect(mockPino.error).toHaveBeenCalledWith('test error');
	});

	it('should log warning messages', () => {
		logger.warn('test warn');
		expect(mockPino.warn).toHaveBeenCalledWith('test warn');
	});

	it('should handle multiple arguments', () => {
		logger.info('info', { foo: 'bar' } as never);
		expect(mockPino.info).toHaveBeenCalledWith('info', { foo: 'bar' });
	});

	it('should handle undefined or null messages gracefully', () => {
		logger.error(undefined);
		expect(mockPino.error).toHaveBeenCalledWith(undefined);

		logger.warn(null);
		expect(mockPino.warn).toHaveBeenCalledWith(null);
	});
});
