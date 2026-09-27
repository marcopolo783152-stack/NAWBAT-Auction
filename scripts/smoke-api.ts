import { createApp } from '../server';

async function main() {
  process.env.JWT_SECRET ||= 'ci-smoke-test-secret-that-is-at-least-32-characters';
  process.env.ADMIN_EMAIL ||= 'admin@nawbat.af';
  process.env.ADMIN_PASSWORD_HASH ||= '$2b$12$abcdefghijklmnopqrstuv12345678901234567890123456789012';

  const app = await createApp(false);
  const server = app.listen(0, '127.0.0.1');

  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Could not determine smoke-test port.');

    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    const data = await response.json();

    if (!response.ok || data?.status !== 'ok') {
      throw new Error(`API health smoke test failed with status ${response.status}.`);
    }

    console.log('NAWBAT API smoke test passed.');
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
