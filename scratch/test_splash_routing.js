const assert = require('assert');

function getDestinationRoute({ termsAccepted, user, mustChangePassword }) {
  if (!termsAccepted) {
    return '/terms-conditions';
  }

  if (!user) {
    return '/login';
  }

  if (mustChangePassword) {
    return '/change-password';
  }

  const role = String(user?.role || '').trim().toLowerCase();
  if (role === 'super_admin') {
    return '/super-admin';
  }

  if (role === 'admin' || role === 'inst_admin') {
    return '/(tabs)/admin';
  }

  return '/(tabs)';
}

console.log('--- Testing Splash Screen Routing Scenarios ---');

// 1. Unaccepted terms
assert.strictEqual(
  getDestinationRoute({ termsAccepted: false, user: { id: '1', role: 'student' }, mustChangePassword: false }),
  '/terms-conditions',
  'Failed: Should redirect to terms if not accepted'
);
console.log('✅ Scenario 1: Unaccepted terms -> /terms-conditions');

// 2. Unauthenticated user
assert.strictEqual(
  getDestinationRoute({ termsAccepted: true, user: null, mustChangePassword: false }),
  '/login',
  'Failed: Should redirect to login if no user'
);
console.log('✅ Scenario 2: Unauthenticated user -> /login');

// 3. Authenticated student needing password change
assert.strictEqual(
  getDestinationRoute({ termsAccepted: true, user: { id: '1', role: 'student' }, mustChangePassword: true }),
  '/change-password',
  'Failed: Should redirect to change password'
);
console.log('✅ Scenario 3: Must change password -> /change-password');

// 4. Authenticated normal student
assert.strictEqual(
  getDestinationRoute({ termsAccepted: true, user: { id: '1', role: 'student' }, mustChangePassword: false }),
  '/(tabs)',
  'Failed: Should redirect to main student tabs'
);
console.log('✅ Scenario 4: Authenticated student -> /(tabs)');

// 5. College admin
assert.strictEqual(
  getDestinationRoute({ termsAccepted: true, user: { id: '1', role: 'admin' }, mustChangePassword: false }),
  '/(tabs)/admin',
  'Failed: Should redirect to admin tabs'
);
console.log('✅ Scenario 5: College Admin -> /(tabs)/admin');

// 6. Super admin
assert.strictEqual(
  getDestinationRoute({ termsAccepted: true, user: { id: '1', role: 'super_admin' }, mustChangePassword: false }),
  '/super-admin',
  'Failed: Should redirect to super-admin dashboard'
);
console.log('✅ Scenario 6: Super Admin -> /super-admin');

console.log('🎉 ALL SPLASH SCREEN ROUTING SCENARIOS PASSED 100%!');
