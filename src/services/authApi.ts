export type NawbatUser = {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  fullNameEn?: string;
  userType: 'buyer' | 'customer' | 'seller' | 'business' | 'staff';
  role: string;
  roleName?: string;
  permissions?: string[];
  status: string;
  kycStatus: string;
  preferredLanguage?: 'fa' | 'ps' | 'en';
};

const TOKEN_KEY = 'nawbat_session_token';
const USER_KEY = 'nawbat_session_user';

async function readApiResponse(res: Response) {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    const preview = text.slice(0, 80).replace(/\s+/g, ' ');
    throw new Error(
      `NAWBAT API returned an invalid response (${res.status}). ` +
      `Please check the Vercel API deployment and environment variables.` +
      (preview ? ` Response started with: ${preview}` : '')
    );
  }
  return res.json();
}

function readUser(): NawbatUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const authApi = {
  tokenKey: TOKEN_KEY,

  token() {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  currentUser(): NawbatUser | null {
    return readUser();
  },

  hasSession() {
    return Boolean(sessionStorage.getItem(TOKEN_KEY));
  },

  saveSession(token: string, user: NawbatUser) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  authHeaders() {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await readApiResponse(res);
    if (!res.ok) throw new Error(data?.error || 'Could not sign in.');
    this.saveSession(data.token, data.user);
    return data.user as NawbatUser;
  },

  async register(input: {
    fullName: string;
    email: string;
    password: string;
    accountType: 'buyer' | 'customer' | 'seller' | 'business';
    preferredLanguage: 'fa' | 'ps' | 'en';
    acceptTerms: boolean;
    acceptPrivacy: boolean;
    acceptFeesRules: boolean;
    agreementReviewed: boolean;
    signatureName: string;
  }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await readApiResponse(res);
    if (!res.ok) throw new Error(data?.error || 'Could not create account.');
    this.saveSession(data.token, data.user);
    return data.user as NawbatUser;
  },

  async refresh() {
    const token = this.token();
    if (!token) return null;
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      this.clearSession();
      return null;
    }
    const user = await readApiResponse(res);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    return user as NawbatUser;
  },

  isStaff(user?: NawbatUser | null) {
    if (!user) return false;
    return user.userType === 'staff' || [
      'superadmin','admin','auction_manager','auctioneer','cataloger','finance','kyc','support','logistics','moderator'
    ].includes(user.role);
  },
};
