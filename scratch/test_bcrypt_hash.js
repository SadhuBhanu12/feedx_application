const bcrypt = require('bcryptjs');

const hash = '$2b$10$QT/RjXnCCigyByFvDVQ9u.lugcTy3o0w1urpwp27t4BtkZGlV5Fhi';
const passwords = [
  'FeedX@123',
  'feedx@123',
  'Admin@123',
  'admin@123',
  'FeedXPolytechnic@123',
  'FeedX',
  'feedx',
  'admin',
  'password',
  '12345678',
  '123456',
  'Bhanu@123',
  'bhanu@123',
  'BhanuPrasad@123'
];

async function check() {
  for (const pw of passwords) {
    const match = await bcrypt.compare(pw, hash);
    if (match) {
      console.log(`FOUND! Password is: ${pw}`);
      return;
    }
  }
  console.log("None of the common passwords matched the hash.");
}
check();
