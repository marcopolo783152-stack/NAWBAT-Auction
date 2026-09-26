import bcrypt from 'bcryptjs';
import { getPool } from './postgres';

export type PublicAccountType = 'buyer' | 'customer' | 'seller' | 'business';

export async function findAuthUserByEmail(email: string) {
  const result = await getPool().query(
    `select
       u.id, u.email, u.phone, u.password_hash, u.full_name, u.full_name_en,
       u.user_type, u.status, u.kyc_status, u.preferred_language,
       coalesce(r.key, u.user_type) as role_key,
       coalesce(r.name_en, initcap(u.user_type)) as role_name,
       coalesce(r.permissions, '[]'::jsonb) as permissions
     from users u
     left join user_roles ur on ur.user_id = u.id
     left join roles r on r.id = ur.role_id
     where lower(u.email::text) = lower($1)
     order by case when r.key in ('superadmin','admin') then 0 else 1 end
     limit 1`,
    [email.trim()],
  );
  return result.rows[0] || null;
}

export async function registerPublicUser(input: {
  fullName: string;
  email: string;
  password: string;
  accountType: PublicAccountType;
  preferredLanguage?: 'fa' | 'ps' | 'en';
}) {
  const hash = await bcrypt.hash(input.password, 12);
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('begin');
    const userResult = await client.query(
      `insert into users
        (full_name, full_name_en, email, password_hash, user_type, status, kyc_status, preferred_language)
       values ($1,$1,$2,$3,$4,'active','unverified',$5)
       returning id, email, phone, full_name, full_name_en, user_type, status, kyc_status, preferred_language, created_at`,
      [
        input.fullName.trim(),
        input.email.trim().toLowerCase(),
        hash,
        input.accountType,
        input.preferredLanguage || 'fa',
      ],
    );

    const user = userResult.rows[0];
    const roleResult = await client.query('select id from roles where key = $1 limit 1', [input.accountType]);
    if (!roleResult.rows[0]) throw new Error('ACCOUNT_ROLE_MISSING');

    await client.query(
      'insert into user_roles(user_id, role_id) values ($1,$2) on conflict do nothing',
      [user.id, roleResult.rows[0].id],
    );
    await client.query('commit');

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.full_name,
      fullNameEn: user.full_name_en,
      userType: user.user_type,
      role: input.accountType,
      status: user.status,
      kycStatus: user.kyc_status,
      preferredLanguage: user.preferred_language,
    };
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}

export async function markLogin(userId: string) {
  await getPool().query('update users set last_login_at = now(), updated_at = now() where id = $1', [userId]);
}

export function safeAuthUser(row: any) {
  return {
    id: row.id,
    email: row.email || '',
    phone: row.phone || '',
    fullName: row.full_name,
    fullNameEn: row.full_name_en || row.full_name,
    userType: row.user_type,
    role: row.role_key || row.user_type,
    roleName: row.role_name || row.user_type,
    permissions: row.permissions || [],
    status: row.status,
    kycStatus: row.kyc_status,
    preferredLanguage: row.preferred_language || 'fa',
  };
}
