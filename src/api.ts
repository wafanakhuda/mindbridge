/**
 * MindBridge API Client
 * Connects frontend to the Express/MongoDB backend
 */

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('mb_token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ─── AUTH ──────────────────────────────────────
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

    register: (email: string, password: string, name: string, role: string) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name, role }) }),

    me: () => request('/auth/me'),
  },

  // ─── SCREENINGS ──────────────────────────────
  screenings: {
    save: (data: {
      phqScore: number; gadScore: number; riskLevel: string;
      riskScore: number; userContext: string; channel: string; isCrisis: boolean;
    }) => request('/screenings', { method: 'POST', body: JSON.stringify(data) }),

    myHistory: () => request('/screenings/my'),

    stats: () => request('/screenings/stats'),
  },

  // ─── APPOINTMENTS ─────────────────────────────
  appointments: {
    getDoctors: (critical = false) =>
      request(`/appointments/doctors${critical ? '?critical=true' : ''}`),

    book: (data: {
      doctorEmail: string; dateTime: string; riskLevel: string;
      notes: string; isCritical: boolean;
    }) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),

    myAppointments: () => request('/appointments/my'),

    allAppointments: () => request('/appointments/all'),

    updateStatus: (id: string, status: string) =>
      request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  // ─── DASHBOARD ───────────────────────────────
  dashboard: {
    clinic: () => request('/dashboard/clinic'),
    admin: () => request('/dashboard/admin'),
  },

  // ─── HEALTH CHECK ────────────────────────────
  health: () => request('/health'),
};

// Auth state helpers
export function saveAuth(token: string, user: any) {
  localStorage.setItem('mb_token', token);
  localStorage.setItem('mb_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('mb_token');
  localStorage.removeItem('mb_user');
}

export function getStoredUser() {
  try {
    const u = localStorage.getItem('mb_user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getToken();
}
