import { describe, test } from 'vitest';
import { spec } from 'pactum';

describe('Basic REST endpoint with payload', () => {
	test('should return 200 response with data', async () => {
		await spec().post('http://localhost:8080/v1/api/test/data/name').withBody({ name: 'Earth' }).expectStatus(200).expectJson({
			name: 'Welcome Earth',
			Age: 28,
		});
	});
});
