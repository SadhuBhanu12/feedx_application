const RULES = [
  { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'uppercase', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { key: 'lowercase', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { key: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
  { key: 'special', label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function validatePassword(password = '') {
  const checks = RULES.reduce((acc, rule) => {
    acc[rule.key] = rule.test(password);
    return acc;
  }, {});

  const passed = Object.values(checks).filter(Boolean).length;
  let strength = 'weak';
  if (passed >= 5) strength = 'strong';
  else if (passed >= 3) strength = 'medium';

  return {
    checks,
    rules: RULES,
    isValid: passed === RULES.length,
    strength,
    score: passed,
  };
}

export function passwordsMatch(password, confirm) {
  return password.length > 0 && password === confirm;
}
