import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password || password.length < 12) {
  console.error('Usage: npm run hash:password -- "your-strong-password"');
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log(hash);
