async function runTests() {
  console.log('--- STARTING RAWG INTEGRATION VERIFICATION ---');

  const BASE_URL = 'http://localhost:5050/api/v1/games';

  // Helper for requests
  const request = async (url) => {
    const res = await fetch(url);
    const body = await res.json();
    return { status: res.status, body };
  };

  // Test 1: Successful Search
  console.log('\n[TEST 1] Successful search for "Witcher"');
  const test1 = await request(`${BASE_URL}/search?q=witcher&page=1&limit=5`);
  if (test1.status !== 200) {
    throw new Error(`Test 1 failed with status ${test1.status}`);
  }
  if (!test1.body.success || !Array.isArray(test1.body.data) || !test1.body.meta) {
    throw new Error(`Test 1 response invalid: ${JSON.stringify(test1.body)}`);
  }
  console.log('Success: Mapped data received:');
  console.log(test1.body.data[0]);
  console.log('Metadata received:', test1.body.meta);

  // Test 2: Search Clamping (page=0, limit=50)
  console.log('\n[TEST 2] Clamping pagination parameters (page=0, limit=50)');
  const test2 = await request(`${BASE_URL}/search?q=witcher&page=0&limit=50`);
  if (test2.status !== 200) {
    throw new Error(`Test 2 failed with status ${test2.status}`);
  }
  if (test2.body.meta.page !== 1 || test2.body.meta.limit !== 40) {
    throw new Error(`Test 2 failed to clamp page/limit: ${JSON.stringify(test2.body.meta)}`);
  }
  console.log(`Success: Clamped to page=${test2.body.meta.page}, limit=${test2.body.meta.limit}`);

  // Test 3: Search Validation error (missing q)
  console.log('\n[TEST 3] Validation check for missing search text');
  const test3 = await request(`${BASE_URL}/search`);
  if (test3.status !== 400 || test3.body.success !== false) {
    throw new Error(`Test 3 failed: expected 400, got ${test3.status}`);
  }
  console.log(`Success: Blocked with message: "${test3.body.message}"`);

  // Test 4: Search Validation error (short q)
  console.log('\n[TEST 4] Validation check for short search text');
  const test4 = await request(`${BASE_URL}/search?q=w`);
  if (test4.status !== 400 || test4.body.success !== false) {
    throw new Error(`Test 4 failed: expected 400, got ${test4.status}`);
  }
  console.log(`Success: Blocked with message: "${test4.body.message}"`);

  // Test 5: Successful Details (GTA V - ID: 3498)
  console.log('\n[TEST 5] Successful details fetch for GTA V (rawgId: 3498)');
  const test5 = await request(`${BASE_URL}/3498`);
  if (test5.status !== 200) {
    throw new Error(`Test 5 failed with status ${test5.status}`);
  }
  const game = test5.body.data;
  if (!test5.body.success || !game.title || !game.platforms) {
    throw new Error(`Test 5 response invalid: ${JSON.stringify(test5.body)}`);
  }
  if (game.description.includes('<p>') || game.description.includes('<br>')) {
    throw new Error(`Test 5 description contains HTML: ${game.description}`);
  }
  console.log('Success: Mapped game details received:');
  console.log(game);

  // Test 6: Details Invalid ID format
  console.log('\n[TEST 6] Validation check for invalid rawgId format');
  const test6 = await request(`${BASE_URL}/abc`);
  if (test6.status !== 400 || test6.body.success !== false) {
    throw new Error(`Test 6 failed: expected 400, got ${test6.status}`);
  }
  console.log(`Success: Blocked with message: "${test6.body.message}"`);

  // Test 7: Details Not Found
  console.log('\n[TEST 7] Error mapping for game not found (rawgId: 99999999)');
  const test7 = await request(`${BASE_URL}/99999999`);
  if (test7.status !== 404 || test7.body.success !== false) {
    throw new Error(`Test 7 failed: expected 404, got ${test7.status}`);
  }
  console.log(`Success: Mapped to: "${test7.body.message}" (status ${test7.status})`);

  console.log('\n--- ALL RAWG INTEGRATION VERIFICATION TESTS PASSED ---');
}

runTests().catch(err => {
  console.error('[VERIFY] Verification failed:', err);
  process.exit(1);
});
