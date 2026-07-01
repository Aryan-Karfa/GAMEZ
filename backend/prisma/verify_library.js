async function runTests() {
  console.log('--- STARTING LIBRARY SYSTEM VERIFICATION ---');

  const BASE_URL = 'http://localhost:5050/api/v1';
  const username = `test_user_${Date.now()}`;
  const email = `test_${Date.now()}@example.com`;
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

  // Step 3: Add Game to Library (GTA V - rawgId: 3498)
  console.log('\n[STEP 3] Adding GTA V (rawgId: 3498) to library...');
  const addRes = await request('POST', '/library', { rawgId: 3498, status: 'PLAYING' }, token);
  if (addRes.status !== 201) {
    throw new Error(`Add game failed with status ${addRes.status}: ${JSON.stringify(addRes.body)}`);
  }
  const entry = addRes.body.data;
  console.log('Success: Game added to library.');
  console.log(entry);

  // Validate DTO Structure
  console.log('\n[STEP 3.5] Validating DTO response structure (stripping DB IDs)...');
  if (entry.userId !== undefined || entry.gameId !== undefined || entry.game?.id !== undefined) {
    throw new Error(`DTO Failure! Database internals leaked: userId=${entry.userId}, gameId=${entry.gameId}, game.id=${entry.game?.id}`);
  }
  if (!entry.id || entry.status !== 'PLAYING' || entry.progress !== 0 || entry.game?.rawgId !== 3498) {
    throw new Error('DTO mapping fields missing or incorrect in response.');
  }
  console.log('Success: Database internals successfully stripped from payload!');

  // Step 4: Duplicate Check
  console.log('\n[STEP 4] Attempting to add duplicate game...');
  const dupRes = await request('POST', '/library', { rawgId: 3498, status: 'TO_PLAY' }, token);
  if (dupRes.status !== 409 || dupRes.body.success !== false) {
    throw new Error(`Duplicate check failed: expected 409, got ${dupRes.status}`);
  }
  console.log(`Success: Blocked duplicate with message: "${dupRes.body.message}"`);

  // Step 5: Get Library
  console.log('\n[STEP 5] Retrieving user library...');
  const getLibRes = await request('GET', '/library', null, token);
  if (getLibRes.status !== 200 || getLibRes.body.data.length !== 1) {
    throw new Error(`Get library failed: ${JSON.stringify(getLibRes.body)}`);
  }
  console.log(`Success: Retrieved library. Entry count: ${getLibRes.body.data.length}`);

  // Step 6: Get Entry Details
  console.log('\n[STEP 6] Retrieving single library entry details...');
  const getDetRes = await request('GET', `/library/${entry.id}`, null, token);
  if (getDetRes.status !== 200 || getDetRes.body.data.id !== entry.id) {
    throw new Error(`Get details failed: ${JSON.stringify(getDetRes.body)}`);
  }
  console.log('Success: Single entry details match.');

  // Step 7: Update Progress (lastProgressUpdate audit check)
  console.log('\n[STEP 7] Updating progress metrics (progress: 15, playTime: 45)...');
  const upProgRes = await request('PATCH', `/library/${entry.id}`, { progress: 15, playTimeMinutes: 45 }, token);
  if (upProgRes.status !== 200) {
    throw new Error(`Update progress failed: ${JSON.stringify(upProgRes.body)}`);
  }
  const updatedEntry = upProgRes.body.data;
  const initialUpdateTimestamp = updatedEntry.lastProgressUpdate;
  if (updatedEntry.progress !== 15 || updatedEntry.playTimeMinutes !== 45 || !initialUpdateTimestamp) {
    throw new Error(`Progress metrics incorrect: ${JSON.stringify(updatedEntry)}`);
  }
  console.log(`Success: Progress updated. lastProgressUpdate: ${initialUpdateTimestamp}`);

  // Step 8: Update only Status (should NOT change lastProgressUpdate)
  console.log('\n[STEP 8] Updating only status (status: COMPLETED)...');
  // Wait 1 second to ensure timestamp would change if updated
  await new Promise(resolve => setTimeout(resolve, 1000));
  const upStatRes = await request('PATCH', `/library/${entry.id}`, { status: 'COMPLETED' }, token);
  if (upStatRes.status !== 200) {
    throw new Error(`Update status failed: ${JSON.stringify(upStatRes.body)}`);
  }
  const statusUpdatedEntry = upStatRes.body.data;
  if (statusUpdatedEntry.status !== 'COMPLETED') {
    throw new Error(`Status update incorrect: ${JSON.stringify(statusUpdatedEntry)}`);
  }
  if (statusUpdatedEntry.lastProgressUpdate !== initialUpdateTimestamp) {
    throw new Error(`Failure: lastProgressUpdate modified on unrelated status update! Initial: ${initialUpdateTimestamp}, Current: ${statusUpdatedEntry.lastProgressUpdate}`);
  }
  console.log('Success: lastProgressUpdate audit timestamp did not modify on unrelated status update!');

  // Step 9: Parameter Clamping Check
  console.log('\n[STEP 9] Verifying parameter bounds (progress: 120)...');
  const invalidRes = await request('PATCH', `/library/${entry.id}`, { progress: 120 }, token);
  if (invalidRes.status !== 400 || invalidRes.body.success !== false) {
    throw new Error(`Bounds check failed: expected 400, got ${invalidRes.status}`);
  }
  console.log(`Success: Correctly blocked invalid progress with message: "${invalidRes.body.message}"`);

  // Step 10: Delete Entry
  console.log('\n[STEP 10] Deleting library entry...');
  const delRes = await request('DELETE', `/library/${entry.id}`, null, token);
  if (delRes.status !== 200) {
    throw new Error(`Delete entry failed: ${JSON.stringify(delRes.body)}`);
  }
  console.log(`Success: Deleted entry with message: "${delRes.body.data.message}"`);

  // Step 11: Assert 404
  console.log('\n[STEP 11] Fetching deleted entry details (expecting 404)...');
  const deletedGetRes = await request('GET', `/library/${entry.id}`, null, token);
  if (deletedGetRes.status !== 404) {
    throw new Error(`Deleted get failed: expected 404, got ${deletedGetRes.status}`);
  }
  console.log('Success: Deleted entry details correctly return 404.');

  console.log('\n--- ALL LIBRARY SYSTEM VERIFICATION TESTS PASSED ---');
}

runTests().catch(err => {
  console.error('[VERIFY] Verification failed:', err);
  process.exit(1);
});
