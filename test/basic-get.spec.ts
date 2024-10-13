import { describe, expect, test } from 'vitest';
import { spec } from 'pactum';

describe('Basic GET REST endpoint', () => {
	test('should return 200 response', async () => {
		await spec().get('http://localhost:8080/v1/api/test/hello').expectStatus(200).expectBody('Hello World');
	});
});
