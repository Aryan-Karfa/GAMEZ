/* global process */
// 1. Mock browser environments before importing modules
globalThis.window = globalThis;
globalThis.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

// 2. Dynamic imports to ensure mocks are active before modules execute
const { default: api } = await import('./src/services/api.js');
const { useAuthStore } = await import('./src/store/authStore.js');
const { useLibraryStore } = await import('./src/store/libraryStore.js');
const { useSearchStore } = await import('./src/store/searchStore.js');
const { useUiStore } = await import('./src/store/uiStore.js');
const { usePreferenceStore } = await import('./src/store/preferenceStore.js');

// 3. Configure Axios baseURL to point to backend server
api.defaults.baseURL = 'http://localhost:5050/api/v1';

async function runTests() {
  console.log('--- STARTING ZUSTAND STORE VERIFICATION ---');

  const username = `store_user_${Date.now()}`;
  const email = `store_${Date.now()}@example.com`;
  const password = 'Password123!';

  // Test 1: UI Store State
  console.log('\n[TEST 1] Testing UI Store...');
  const ui = useUiStore.getState();
  console.log('Initial Sidebar:', ui.sidebarState);
  
  ui.toggleSidebar();
  ui.addToast('Test toast message', 'success');

  const updatedUi = useUiStore.getState();
  console.log('Updated Sidebar:', updatedUi.sidebarState);
  console.log('Toasts count:', updatedUi.toasts.length);
  
  if (updatedUi.sidebarState !== 'closed' || updatedUi.toasts.length !== 1) {
    throw new Error('UI Store state update failed.');
  }

  // Test 2: Auth Store Registration & Login
  console.log('\n[TEST 2] Testing Auth Store (Register & Login)...');
  const auth = useAuthStore.getState();
  
  // Register
  console.log('Registering user...');
  const regRes = await auth.register(username, email, password);
  if (!regRes.success) {
    throw new Error(`Registration failed: ${regRes.error}`);
  }
  console.log('Registration success.');

  // Login
  console.log('Logging in user...');
  const loginRes = await auth.login(email, password);
  if (!loginRes.success) {
    throw new Error(`Login failed: ${loginRes.error}`);
  }
  
  const authAfterLogin = useAuthStore.getState();
  console.log('Is Authenticated:', authAfterLogin.isAuthenticated);
  console.log('Logged in User:', authAfterLogin.user);
  console.log('JWT Token retrieved:', authAfterLogin.token ? 'YES' : 'NO');

  if (!authAfterLogin.isAuthenticated || !authAfterLogin.user || !authAfterLogin.token) {
    throw new Error('Auth Store login state failed.');
  }

  // Test 3: Persistence Check (Token only, not user)
  console.log('\n[TEST 3] Testing Storage Persistence...');
  const persistedData = JSON.parse(globalThis.localStorage.getItem('auth-storage'));
  console.log('Persisted Keys:', Object.keys(persistedData.state));
  console.log('Persisted Token:', persistedData.state.token ? 'YES' : 'NO');
  console.log('Persisted User (should be undefined/null):', persistedData.state.user);

  if (persistedData.state.user !== undefined && persistedData.state.user !== null) {
    throw new Error('Security Failure: User profile object was persisted in localStorage!');
  }
  if (!persistedData.state.token) {
    throw new Error('Persistence Failure: Token was not persisted in localStorage.');
  }
  console.log('Success: Storage persistence constraints passed.');

  // Test 4: Search Store
  console.log('\n[TEST 4] Testing Search Store (Witcher query)...');
  const search = useSearchStore.getState();
  await search.search('witcher', 1, 5);
  
  const searchAfterSearch = useSearchStore.getState();
  console.log('Search Results count:', searchAfterSearch.results.length);
  console.log('Search metadata:', searchAfterSearch.meta);
  
  if (searchAfterSearch.results.length === 0 || !searchAfterSearch.meta.hasNextPage) {
    throw new Error('Search Store fetch failed.');
  }

  // Test 5: Library Store CRUD
  console.log('\n[TEST 5] Testing Library Store CRUD...');
  const library = useLibraryStore.getState();
  
  // Add GTA V
  console.log('Adding game to library...');
  const addRes = await library.addGame(3498, 'PLAYING');
  if (!addRes.success) {
    throw new Error(`Add game failed: ${addRes.error}`);
  }
  
  let libraryState = useLibraryStore.getState();
  console.log('Library entries count:', libraryState.entries.length);
  const entryId = libraryState.entries[0]?.id;
  console.log('Added entry tracking ID:', entryId);
  console.log('Entry Details (DTO mapped, no db IDs):', libraryState.entries[0]);

  if (libraryState.entries.length !== 1 || libraryState.entries[0].userId !== undefined) {
    throw new Error('Library add state failed.');
  }

  // Update progress
  console.log('Updating library progress...');
  const updateRes = await library.updateEntry(entryId, { progress: 30, playTimeMinutes: 60 });
  if (!updateRes.success) {
    throw new Error(`Update entry failed: ${updateRes.error}`);
  }
  
  libraryState = useLibraryStore.getState();
  console.log('Updated progress:', libraryState.entries[0].progress);
  console.log('Updated playTimeMinutes:', libraryState.entries[0].playTimeMinutes);
  
  if (libraryState.entries[0].progress !== 30 || libraryState.entries[0].playTimeMinutes !== 60) {
    throw new Error('Library update state failed.');
  }

  // Test 6: Preference Store
  console.log('\n[TEST 6] Testing Preference Store...');
  const prefStore = usePreferenceStore.getState();
  console.log('Initial Preference defaultView:', prefStore.preferences.defaultView);
  console.log('Initial Preference theme:', prefStore.preferences.theme);

  console.log('Fetching preferences...');
  await usePreferenceStore.getState().fetchPreferences();
  let updatedPref = usePreferenceStore.getState();
  console.log('Fetched defaultView:', updatedPref.preferences.defaultView);
  console.log('Fetched theme:', updatedPref.preferences.theme);

  if (updatedPref.preferences.theme !== 'DARK' || updatedPref.preferences.defaultView !== 'CARD') {
    throw new Error('Preference Store fetch failed.');
  }

  console.log('Updating preference to SHELF...');
  await usePreferenceStore.getState().updatePreference({ defaultView: 'SHELF' });
  updatedPref = usePreferenceStore.getState();
  console.log('Updated defaultView:', updatedPref.preferences.defaultView);
  if (updatedPref.preferences.defaultView !== 'SHELF') {
    throw new Error('Preference Store update failed.');
  }

  // Test 7: Reset on Logout
  console.log('\n[TEST 7] Testing global resets on Logout...');
  await useAuthStore.getState().logout();
  
  const authAfterLogout = useAuthStore.getState();
  const libraryAfterLogout = useLibraryStore.getState();
  const searchAfterLogout = useSearchStore.getState();
  const uiAfterLogout = useUiStore.getState();
  const prefAfterLogout = usePreferenceStore.getState();

  console.log('Auth Store User after logout:', authAfterLogout.user);
  console.log('Auth Store Token after logout:', authAfterLogout.token);
  console.log('Library entries after logout:', libraryAfterLogout.entries.length);
  console.log('Search query after logout:', searchAfterLogout.query);
  console.log('UI Active Modal after logout:', uiAfterLogout.activeModal);
  console.log('Preferences defaultView after logout:', prefAfterLogout.preferences.defaultView);

  if (
    authAfterLogout.user !== null || 
    authAfterLogout.token !== null || 
    libraryAfterLogout.entries.length !== 0 || 
    searchAfterLogout.results.length !== 0 || 
    prefAfterLogout.preferences.defaultView !== 'CARD'
  ) {
    throw new Error('Store logout reset strategy failed.');
  }

  console.log('\n--- ALL ZUSTAND STORE TESTS PASSED SUCCESSFULLY ---');
}

runTests().catch(err => {
  console.error('[VERIFY] Verification failed:', err);
  process.exit(1);
});
