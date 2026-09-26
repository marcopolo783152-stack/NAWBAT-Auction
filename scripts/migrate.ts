import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getPool } from '../src/server/postgres';

const schemaPath = path.resolve(process.cwd(), 'db/schema.sql');
const sql = await fs.readFile(schemaPath, 'utf8');

const pool = getPool();
try {
  await pool.query(sql);
  console.log('NAWBAT database schema applied successfully.');
} finally {
  await pool.end();
}
