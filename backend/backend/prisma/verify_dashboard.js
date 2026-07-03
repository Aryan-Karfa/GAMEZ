async function runTests() {
  console.log('--- STARTING DASHBOARD INTEGRATION VERIFICATION ---');

  const BASE_URL = 'http://localhost:5050/api/v1';
  const username = `dash_user_${Date.now()}`;
  const email = `dash_${Date.now()}@example.com`;
  const password = 'Password123!';

  // Helper for requests
  const request = async (method, path, body = null, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    const responseBody = await res.json();
    return { status: res.status, body: responseBody };
  };

  // Step 1: Register User
  console.log('\n[STEP 1] Registering test user...');
  const regRes = await request('POST', '/auth/register', { username, email, password });
  if (regRes.status !== 201 && regRes.status !== 200) {
    throw new Error(`Register failed with status ${regRes.status}: ${JSON.stringify(regRes.body)}`);
  }
  console.log(`Success: Registered user "${username}"`);

  // Step 2: Login User
  console.log('\n[STEP 2] Logging in user...');
  const loginRes = await request('POST', '/auth/login', { email, password });
  if (loginRes.status !== 200 || !loginRes.body.data?.token) {
    throw new Error(`Login failed with status ${loginRes.status}: ${JSON.stringify(loginRes.body)}`);
  }
  const token = loginRes.body.data.token;
  console.log('Success: Logged in, JWT token retrieved.');

  // Step 3: Add Game 1 to Library (GTA V - rawgId: 3498, Status: PLAYING)
  console.log('\n[STEP 3] Adding GTA V (rawgId: 3498) to library...');
  const add1 = await request('POST', '/library', { rawgId: 3498, status: 'PLAYING' }, token);
  if (add1.status !== 201) {
    throw new Error(`Add GTA V failed: ${JSON.stringify(add1.body)}`);
  }
  console.log('Success: GTA V added.');

  // Step 4: Add Game 2 to Library (Witcher 3 - rawgId: 3328, Status: TO_PLAY)
  console.log('\n[STEP 4] Adding Witcher 3 (rawgId: 3328) to library...');
  const add2 = await request('POST', '/library', { rawgId: 3328, status: 'TO_PLAY' }, token);
  if (add2.status !== 201) {
    throw new Error(`Add Witcher 3 failed: ${JSON.stringify(add2.body)}`);
  }
  console.log('Success: Witcher 3 added.');

  // Step 5: Verify Dashboard Summary
  console.log('\n[STEP 5] Querying GET /dashboard summary...');
  const dashRes = await request('GET', '/dashboard', null, token);
  if (dashRes.status !== 200) {
    throw new Error(`GET /dashboard failed with status ${dashRes.status}: ${JSON.stringify(dashRes.body)}`);
  }
  
  const summary = dashRes.body.data;
  console.log('Retrieved Dashboard Summary Data:', JSON.stringify(summary, null, 2));

  // Assert stats are correct
  const { stats, recentlyUpdated, recentAdditions } = summary;
  if (stats.totalGames !== 2 || stats.playing !== 1 || stats.toPlay !== 1 || stats.completed !== 0) {
    throw new Error(`Statistics count mismatch: ${JSON.stringify(stats)}`);
  }
  if (stats.completionRate !== 0) {
    throw new Error(`Completion rate mismatch: expected 0, got ${stats.completionRate}`);
  }
  if (recentlyUpdated.length !== 2 || recentAdditions.length !== 2) {
    throw new Error(`Feeds length mismatch: updated=${recentlyUpdated.length}, added=${recentAdditions.length}`);
  }

  // Verify DTO leakage
  if (recentlyUpdated[0].userId !== undefined || recentlyUpdated[0].gameId !== undefined || recentlyUpdated[0].game?.id !== undefined) {
    throw new Error('Database internals leaked in dashboard summary feeds.');
  }
  console.log('Success: Dashboard statistics and list structures verified.');

  // Step 6: Verify Continue Playing
  console.log('\n[STEP 6] Querying GET /dashboard/continue-playing...');
  const cpRes = await request('GET', '/dashboard/continue-playing', null, token);
  if (cpRes.status !== 200) {
    throw new Error(`GET /dashboard/continue-playing failed: ${JSON.stringify(cpRes.body)}`);
  }

  const cpList = cpRes.body.data;
  console.log('Retrieved Continue Playing Data:', JSON.stringify(cpList, null, 2));
  
  if (cpList.length !== 1) {
    throw new Error(`Continue Playing list length mismatch: expected 1, got ${cpList.length}`);
  }
  if (cpList[0].game.rawgId !== 3498 || cpList[0].status !== 'PLAYING') {
    throw new Error(`Continue Playing entry mismatch: ${JSON.stringify(cpList[0])}`);
  }
  
  // Verify DTO leakage
  if (cpList[0].userId !== undefined || cpList[0].gameId !== undefined || cpList[0].game?.id !== undefined) {
    throw new Error('Database internals leaked in continue playing feed.');
  }
  console.log('Success: Continue playing details and sorting verified.');

  console.log('\n--- ALL DASHBOARD INTEGRATION TESTS PASSED SUCCESSFULLY ---');
}

runTests().catch(err => {
  console.error('[VERIFY] Verification failed:', err);
  process.exit(1);
});
