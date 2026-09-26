import bcrypt from 'bcryptjs';
import { getPool } from './postgres';

export function hasPersistentDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function roleTitleFor(userType: string) {
  if (userType === 'staff') return 'Staff';
  if (userType === 'business') return 'Business Seller';
  if (userType === 'seller') return 'Seller';
  return 'Buyer';
}

function mapUser(row: any) {
  return {
    id: row.id,
    username: row.email ? String(row.email).split('@')[0] : row.phone || row.id,
    fullName: row.full_name,
    fullNameEn: row.full_name_en || row.full_name,
    email: row.email || '',
    phone: row.phone || '',
    roleId: row.role_key || `role-${row.user_type}`,
    roleTitle: row.role_name || roleTitleFor(row.user_type),
    userType: row.user_type,
    status: row.status,
    isBiddingBlocked: row.is_bidding_blocked,
    isSellingBlocked: row.is_selling_blocked,
    kycStatus: row.kyc_status,
    tazkiraNumber: row.tazkira_number || '',
    businessRegNumber: row.business_reg_number || undefined,
    balanceAFN: 0,
    escrowLockedAFN: 0,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at || row.created_at,
    ipAddress: '',
    deviceFingerprint: '',
    internalNotes: row.internal_notes || [],
    permissions: row.permissions || [],
  };
}

const baseSelect = `
  select
    u.*,
    r.key as role_key,
    r.name_en as role_name,
    coalesce(r.permissions, '[]'::jsonb) as permissions,
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id,
        'author', coalesce(a.full_name, 'System'),
        'note', n.note,
        'timestamp', n.created_at
      ) order by n.created_at desc)
      from admin_notes n
      left join users a on a.id = n.author_user_id
      where n.user_id = u.id
    ), '[]'::jsonb) as internal_notes
  from users u
  left join user_roles ur on ur.user_id = u.id
  left join roles r on r.id = ur.role_id
`;

export async function listPersistentUsers(filters: {
  search?: string;
  userType?: string;
  status?: string;
  kycStatus?: string;
}) {
  const values: any[] = [];
  const where: string[] = [];

  if (filters.search) {
    values.push(`%${filters.search}%`);
    where.push(`(u.full_name ilike $${values.length} or coalesce(u.full_name_en,'') ilike $${values.length} or coalesce(u.email::text,'') ilike $${values.length} or coalesce(u.phone,'') ilike $${values.length})`);
  }
  if (filters.userType && filters.userType !== 'all') {
    values.push(filters.userType);
    where.push(`u.user_type = $${values.length}`);
  }
  if (filters.status && filters.status !== 'all') {
    values.push(filters.status);
    where.push(`u.status = $${values.length}`);
  }
  if (filters.kycStatus && filters.kycStatus !== 'all') {
    values.push(filters.kycStatus);
    where.push(`u.kyc_status = $${values.length}`);
  }

  const sql = `${baseSelect} ${where.length ? 'where ' + where.join(' and ') : ''} order by u.created_at desc`;
  const result = await getPool().query(sql, values);
  return result.rows.map(mapUser);
}

export async function getPersistentUser(id: string) {
  const result = await getPool().query(`${baseSelect} where u.id = $1 limit 1`, [id]);
  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

export async function createPersistentUser(input: {
  fullName: string;
  fullNameEn?: string;
  email?: string;
  phone?: string;
  userType: 'buyer' | 'customer' | 'seller' | 'business' | 'staff';
  tazkiraNumber?: string;
  roleKey?: string;
  temporaryPassword?: string;
}) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('begin');
    const passwordHash = input.temporaryPassword ? await bcrypt.hash(input.temporaryPassword, 12) : null;
    const userResult = await client.query(
      `insert into users
        (full_name, full_name_en, email, phone, password_hash, user_type, status, kyc_status, tazkira_number)
       values ($1,$2,$3,$4,$5,$6,'active','pending',$7)
       returning *`,
      [
        input.fullName,
        input.fullNameEn || input.fullName,
        input.email || null,
        input.phone || null,
        passwordHash,
        input.userType,
        input.tazkiraNumber || null,
      ],
    );

    const user = userResult.rows[0];
    const roleKey = input.roleKey || (input.userType === 'staff' ? 'support' : input.userType);
    const roleResult = await client.query('select id from roles where key = $1 limit 1', [roleKey]);
    if (roleResult.rows[0]) {
      await client.query(
        'insert into user_roles(user_id, role_id) values($1,$2) on conflict do nothing',
        [user.id, roleResult.rows[0].id],
      );
    }

    await client.query(
      `insert into admin_notes(user_id, note) values ($1, 'Account created from NAWBAT admin portal')`,
      [user.id],
    );
    await client.query('commit');
    return await getPersistentUser(user.id);
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}

export async function updatePersistentUser(
  id: string,
  changes: {
    status?: string;
    isBiddingBlocked?: boolean;
    isSellingBlocked?: boolean;
    kycStatus?: string;
    newNote?: string;
  },
) {
  const sets: string[] = [];
  const values: any[] = [];

  const push = (column: string, value: any) => {
    values.push(value);
    sets.push(`${column} = $${values.length}`);
  };

  if (changes.status !== undefined) push('status', changes.status);
  if (changes.isBiddingBlocked !== undefined) push('is_bidding_blocked', changes.isBiddingBlocked);
  if (changes.isSellingBlocked !== undefined) push('is_selling_blocked', changes.isSellingBlocked);
  if (changes.kycStatus !== undefined) push('kyc_status', changes.kycStatus);

  if (sets.length) {
    values.push(id);
    await getPool().query(
      `update users set ${sets.join(', ')}, updated_at = now() where id = $${values.length}`,
      values,
    );
  }

  if (changes.newNote?.trim()) {
    await getPool().query('insert into admin_notes(user_id, note) values ($1,$2)', [id, changes.newNote.trim()]);
  }

  return await getPersistentUser(id);
}
