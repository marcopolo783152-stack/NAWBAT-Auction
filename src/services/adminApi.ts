const TOKEN_KEY = 'nawbat_admin_token';

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function authHeaders(extra?: Record<string, string>) {
  const token = getToken();
  return {
    ...(extra || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path: string, init: RequestInit = {}) {
  const headers = authHeaders(init.headers as Record<string, string> | undefined);
  const res = await fetch(path, { ...init, headers });

  if (res.status === 401) {
    sessionStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new CustomEvent('nawbat-admin-session-expired'));
  }

  return res;
}

export const adminAuth = {
  tokenKey: TOKEN_KEY,
  saveToken(token: string) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  },
  hasSession() {
    return Boolean(getToken());
  },
};

export const adminApi = {
  async getOverview() {
    try {
      const res = await request('/api/admin/overview');
      if (!res.ok) throw new Error('Failed to fetch overview');
      return await res.json();
    } catch { return null; }
  },

  async getUsers(params?: { search?: string; userType?: string; status?: string; kycStatus?: string }) {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await request(`/api/admin/users?${query}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    } catch { return []; }
  },

  async getUserById(id: string) {
    try {
      const res = await request(`/api/admin/users/${id}`);
      if (!res.ok) throw new Error('Failed to fetch user details');
      return await res.json();
    } catch { return null; }
  },

  async createUser(data: any) {
    const res = await request('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateUser(id: string, data: any) {
    const res = await request(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async getRoles() {
    try {
      const res = await request('/api/admin/roles');
      if (!res.ok) throw new Error('Failed to fetch roles');
      return await res.json();
    } catch { return []; }
  },

  async updateRole(id: string, data: any) {
    const res = await request(`/api/admin/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async getAuctions(params?: { status?: string; province?: string; category?: string }) {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await request(`/api/admin/auctions?${query}`);
      if (!res.ok) throw new Error('Failed to fetch auctions');
      return await res.json();
    } catch { return []; }
  },

  async createAuction(data: any) {
    const res = await request('/api/admin/auctions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    return await res.json();
  },

  async executeAuctionAction(id: string, action: string, extensionMinutes?: number) {
    const res = await request(`/api/admin/auctions/${id}/action`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, extensionMinutes }),
    });
    return await res.json();
  },

  async getKycCases() {
    try {
      const res = await request('/api/admin/kyc');
      if (!res.ok) throw new Error('Failed to fetch KYC');
      return await res.json();
    } catch { return []; }
  },

  async decideKyc(id: string, decision: 'approved' | 'rejected' | 'resubmission_requested', reason?: string) {
    const res = await request(`/api/admin/kyc/${id}/decision`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ decision, reason }),
    });
    return await res.json();
  },

  async getFinanceSummary() {
    try {
      const res = await request('/api/admin/finance/summary');
      if (!res.ok) throw new Error('Failed to fetch finance');
      return await res.json();
    } catch { return null; }
  },

  async getInvoices() {
    try { const res = await request('/api/admin/finance/invoices'); return res.ok ? await res.json() : []; } catch { return []; }
  },
  async getLedger() {
    try { const res = await request('/api/admin/finance/ledger'); return res.ok ? await res.json() : []; } catch { return []; }
  },
  async executePayout(invoiceId: string) {
    const res = await request('/api/admin/finance/payout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ invoiceId }),
    });
    return await res.json();
  },
  async issueRefund(invoiceId: string, reason: string) {
    const res = await request('/api/admin/finance/refund', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ invoiceId, reason }),
    });
    return await res.json();
  },

  async getFraudFlags() {
    try { const res = await request('/api/admin/fraud/flags'); return res.ok ? await res.json() : []; } catch { return []; }
  },
  async resolveFraudFlag(id: string, status: string, actionNote?: string) {
    const res = await request(`/api/admin/fraud/flags/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, actionNote }),
    });
    return await res.json();
  },

  async getDisputes() {
    try { const res = await request('/api/admin/disputes'); return res.ok ? await res.json() : []; } catch { return []; }
  },
  async postDisputeMessage(id: string, text: string) {
    const res = await request(`/api/admin/disputes/${id}/message`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }),
    });
    return await res.json();
  },
  async resolveDispute(id: string, resolution: string, notes: string) {
    const res = await request(`/api/admin/disputes/${id}/resolve`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resolution, notes }),
    });
    return await res.json();
  },

  async getLogistics() {
    try { const res = await request('/api/admin/logistics'); return res.ok ? await res.json() : []; } catch { return []; }
  },
  async verifyQrRelease(qrCode: string, pinCode: string) {
    const res = await request('/api/admin/logistics/verify-qr', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qrCode, pinCode }),
    });
    return await res.json();
  },

  async getSettings() {
    try { const res = await request('/api/admin/settings'); return res.ok ? await res.json() : null; } catch { return null; }
  },
  async updateSettings(data: any) {
    const res = await request('/api/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    return await res.json();
  },

  async getAuditLogs() {
    try { const res = await request('/api/admin/audit-logs'); return res.ok ? await res.json() : []; } catch { return []; }
  },

  async getUserProfile() {
    try {
      const res = await fetch('/api/user/profile');
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch { return null; }
  },

  async updateNotificationPreferences(preferences: { emailOutbid: boolean; emailClosingSoon: boolean; emailHesabPayReceipts?: boolean }) {
    const res = await fetch('/api/user/notification-preferences', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(preferences),
    });
    return await res.json();
  },
};
