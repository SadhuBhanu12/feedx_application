// Unit test for Security Reset Logic on APK download
const assert = require('assert');

function simulateAppLaunch(installedSignature, mockStorage, mockAsyncStorage, mockSession) {
  const CURRENT_BUILD_SIGNATURE = 'feedx_v1.2.8_build_13_security_reset_2026';
  let user = null;
  let authStatus = 'INITIALIZING';
  let booting = true;

  // Step 1: Check build signature
  if (installedSignature !== CURRENT_BUILD_SIGNATURE) {
    // Purge everything
    delete mockStorage['auth-store'];
    delete mockStorage['auth-store-v2'];
    delete mockStorage['auth-store-v3'];
    delete mockStorage['terms_accepted_v1'];

    Object.keys(mockAsyncStorage).forEach((k) => {
      if (k.startsWith('sb-') || k.includes('supabase') || k.includes('auth') || k.includes('session')) {
        delete mockAsyncStorage[k];
      }
    });

    user = null;
    authStatus = 'UNAUTHENTICATED';
    mockStorage['feedx_installed_build_signature'] = CURRENT_BUILD_SIGNATURE;
    booting = false;

    return { user, authStatus, booting, mockStorage, mockAsyncStorage };
  }

  // Step 2: Live session check
  if (mockSession?.user) {
    user = mockSession.user;
    authStatus = 'AUTHENTICATED';
  } else {
    user = null;
    authStatus = 'UNAUTHENTICATED';
  }
  booting = false;

  return { user, authStatus, booting, mockStorage, mockAsyncStorage };
}

// Test 1: Fresh download with previous session left behind by Android update
const mockStorage1 = {
  'auth-store-v3': JSON.stringify({ state: { user: { id: 'user_123', email: 'test@student.edu' } } }),
  'feedx_installed_build_signature': 'feedx_v1.2.7_old',
  'terms_accepted_v1': 'true'
};
const mockAsyncStorage1 = {
  'sb-ktontqbfcinzqvalxyqd-auth-token': 'eyJhbGciOi...',
  'other_data': 'preserved'
};

const result1 = simulateAppLaunch('feedx_v1.2.7_old', mockStorage1, mockAsyncStorage1, null);

assert.strictEqual(result1.user, null, 'User must be null on new download');
assert.strictEqual(result1.authStatus, 'UNAUTHENTICATED', 'Must be UNAUTHENTICATED on new download');
assert.strictEqual(result1.mockStorage['auth-store-v3'], undefined, 'auth-store-v3 must be purged');
assert.strictEqual(result1.mockStorage['terms_accepted_v1'], undefined, 'terms must be re-confirmed');
assert.strictEqual(result1.mockAsyncStorage['sb-ktontqbfcinzqvalxyqd-auth-token'], undefined, 'Supabase token must be purged');
assert.strictEqual(result1.mockAsyncStorage['other_data'], 'preserved', 'Non-auth data preserved');
assert.strictEqual(result1.mockStorage['feedx_installed_build_signature'], 'feedx_v1.2.8_build_13_security_reset_2026');

console.log('Test 1 PASSED: Fresh APK download completely purges old credentials.');

// Test 2: Next launch with no user (remains unauthenticated)
const result2 = simulateAppLaunch('feedx_v1.2.8_build_13_security_reset_2026', result1.mockStorage, result1.mockAsyncStorage, null);
assert.strictEqual(result2.user, null, 'User remains null');
assert.strictEqual(result2.authStatus, 'UNAUTHENTICATED');

console.log('Test 2 PASSED: Next launch without login stays unauthenticated.');

// Test 3: Next launch after user actively logged in
const result3 = simulateAppLaunch('feedx_v1.2.8_build_13_security_reset_2026', result1.mockStorage, result1.mockAsyncStorage, {
  user: { id: 'bhanu_id', email: 'bhanu@feedx.app' }
});
assert.strictEqual(result3.user.id, 'bhanu_id');
assert.strictEqual(result3.authStatus, 'AUTHENTICATED');

console.log('Test 3 PASSED: Active live session restores properly after user logs in.');

console.log('\nALL AUTH SECURITY TESTS PASSED SUCCESSFULLY!');
