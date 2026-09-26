// Admin REST API Client Service connecting frontend directly to full-stack Express backend

export const adminApi = {
  // 1. Overview KPIs
  async getOverview() {
    try {
      const res = await fetch('/api/admin/overview');
      if (!res.ok) throw new Error('Failed to fetch overview');
      return await res.json();
    } catch {
      return null;
    }
  },

  // 2. Users
  async getUsers(params?: { search?: string; userType?: string; status?: string; kycStatus?: string }) {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`/api/admin/users?${query}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    } catch {
      return [];
    }
  },

  async getUserById(id: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) throw new Error('Failed to fetch user details');
      return await res.json();
    } catch {
      return null;
    }
  },

  async createUser(data: any) {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateUser(id: string, data: any) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // 3. Roles & Permissions
  async getRoles() {
    try {
      const res = await fetch('/api/admin/roles');
      return await res.json();
    } catch {
      return [];
    }
  },

  async updateRole(id: string, data: any) {
    const res = await fetch(`/api/admin/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // 4. Auctions
  async getAuctions(params?: { status?: string; province?: string; category?: string }) {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`/api/admin/auctions?${query}`);
      return await res.json();
    } catch {
      return [];
    }
  },

  async createAuction(data: any) {
    const res = await fetch('/api/admin/auctions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async executeAuctionAction(id: string, action: string, extensionMinutes?: number) {
    const res = await fetch(`/api/admin/auctions/${id}/action`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, extensionMinutes }),
    });
    return await res.json();
  },

  // 5. KYC & Tazkira Center
  async getKycCases() {
    try {
      const res = await fetch('/api/admin/kyc');
      return await res.json();
    } catch {
      return [];
    }
  },

  async decideKyc(id: string, decision: 'approved' | 'rejected' | 'resubmission_requested', reason?: string) {
    const res = await fetch(`/api/admin/kyc/${id}/decision`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, reason }),
    });
    return await res.json();
  },

  // 6. Finance & HesabPay
  async getFinanceSummary() {
    try {
      const res = await fetch('/api/admin/finance/summary');
      return await res.json();
    } catch {
      return null;
    }
  },

  async getInvoices() {
    try {
      const res = await fetch('/api/admin/finance/invoices');
      return await res.json();
    } catch {
      return [];
    }
  },

  async getLedger() {
    try {
      const res = await fetch('/api/admin/finance/ledger');
      return await res.json();
    } catch {
      return [];
    }
  },

  async executePayout(invoiceId: string) {
    const res = await fetch('/api/admin/finance/payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId }),
    });
    return await res.json();
  },

  async issueRefund(invoiceId: string, reason: string) {
    const res = await fetch('/api/admin/finance/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId, reason }),
    });
    return await res.json();
  },

  // 7. Fraud & Security
  async getFraudFlags() {
    try {
      const res = await fetch('/api/admin/fraud/flags');
      return await res.json();
    } catch {
      return [];
    }
  },

  async resolveFraudFlag(id: string, status: string, actionNote?: string) {
    const res = await fetch(`/api/admin/fraud/flags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, actionNote }),
    });
    return await res.json();
  },

  // 8. Disputes & Mediation
  async getDisputes() {
    try {
      const res = await fetch('/api/admin/disputes');
      return await res.json();
    } catch {
      return [];
    }
  },

  async postDisputeMessage(id: string, text: string) {
    const res = await fetch(`/api/admin/disputes/${id}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return await res.json();
  },

  async resolveDispute(id: string, resolution: string, notes: string) {
    const res = await fetch(`/api/admin/disputes/${id}/resolve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution, notes }),
    });
    return await res.json();
  },

  // 9. Logistics & Pickup
  async getLogistics() {
    try {
      const res = await fetch('/api/admin/logistics');
      return await res.json();
    } catch {
      return [];
    }
  },

  async verifyQrRelease(qrCode: string, pinCode: string) {
    const res = await fetch('/api/admin/logistics/verify-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrCode, pinCode }),
    });
    return await res.json();
  },

  // 10. Platform Settings
  async getSettings() {
    try {
      const res = await fetch('/api/admin/settings');
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateSettings(data: any) {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // 11. Audit Logs
  async getAuditLogs() {
    try {
      const res = await fetch('/api/admin/audit-logs');
      return await res.json();
    } catch {
      return [];
    }
  },

  // 12. User Profile & Notification Preferences
  async getUserProfile() {
    try {
      const res = await fetch('/api/user/profile');
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateNotificationPreferences(preferences: { emailOutbid: boolean; emailClosingSoon: boolean; emailHesabPayReceipts?: boolean }) {
    const res = await fetch('/api/user/notification-preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    return await res.json();
  },
};
