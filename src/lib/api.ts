// API Client for Ritmo Backend

const API_URL = import.meta.env.VITE_RITMO_API_URL || 'http://192.168.1.189:8000';

export interface ApiError {
  message: string;
  status: number;
  detail?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let detail = '';
      try {
        const errorData = await response.json();
        detail = errorData.detail || errorData.message || '';
      } catch {
        detail = response.statusText;
      }

      // Handle token expiration
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (!refreshed) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }

      throw {
        message: detail || `HTTP Error ${response.status}`,
        status: response.status,
        detail,
      } as ApiError;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        return true;
      }
    } catch {
      // Refresh failed
    }
    return false;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(API_URL);

// Types based on OpenAPI spec
export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  business_name: string;
  slug: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  price_cents: number;
  requires_deposit: boolean;
  deposit_cents: number | null;
  is_active: boolean;
}

export interface ServiceCreate {
  name: string;
  description?: string | null;
  duration_minutes: number;
  buffer_before_minutes?: number;
  buffer_after_minutes?: number;
  price_cents: number;
  requires_deposit?: boolean;
  deposit_cents?: number | null;
  is_active?: boolean;
}

export interface Staff {
  id: string;
  display_name: string;
  is_active: boolean;
}

export interface StaffCreate {
  display_name: string;
  is_active?: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  tags: string[];
  notes: string | null;
  consents: Record<string, boolean>;
  created_at: string;
}

export interface ClientCreate {
  name: string;
  phone?: string | null;
  email?: string | null;
  tags?: string[];
  notes?: string | null;
}

export interface WorkingHours {
  id: string;
  staff_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
}

export interface WorkingHoursCreate {
  staff_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
}

export interface TimeOff {
  id: string;
  staff_id: string;
  start_at: string;
  end_at: string;
  reason: string | null;
}

export interface TimeOffCreate {
  staff_id: string;
  start_at: string;
  end_at: string;
  reason?: string | null;
}

export interface Appointment {
  id: string;
  service_id: string;
  staff_id: string;
  client_id: string;
  start_at: string;
  end_at: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes: string | null;
  source: string;
  created_at: string;
  service?: Service;
  staff?: Staff;
  client?: Client;
}

export interface AppointmentCreate {
  service_id: string;
  staff_id: string;
  client_id: string;
  start_at: string;
  notes?: string | null;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  staff_id: string;
  staff_name?: string;
}

export interface AvailabilityResponse {
  slots: AvailabilitySlot[];
}

export interface TenantProfile {
  id: string;
  slug: string;
  business_name: string;
  business_type: string | null;
  phone: string | null;
  address: Record<string, string> | null;
}

export interface TenantSettings {
  cancellation_policy?: {
    min_hours_before?: number;
    allow_reschedule?: boolean;
  };
  booking_policy?: {
    max_days_ahead?: number;
    min_hours_before?: number;
  };
  notifications?: {
    reminder_hours_before?: number[];
    sms_enabled?: boolean;
    email_enabled?: boolean;
  };
}

export interface Waitlist {
  id: string;
  client_id: string;
  service_id: string;
  preferred_staff_id: string | null;
  preferred_date_start: string;
  preferred_date_end: string;
  status: 'waiting' | 'offered' | 'confirmed' | 'expired' | 'cancelled';
  created_at: string;
}

export interface WaitlistCreate {
  client_id: string;
  service_id: string;
  preferred_staff_id?: string | null;
  preferred_date_start: string;
  preferred_date_end: string;
}

// Auth API
export const authApi = {
  login: (data: LoginRequest) => api.post<TokenPair>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<TokenPair>('/auth/register', data),
  refresh: (refresh_token: string) => api.post<TokenPair>('/auth/refresh', { refresh_token }),
};

// Services API
export const servicesApi = {
  list: () => api.get<Service[]>('/services'),
  get: (id: string) => api.get<Service>(`/services/${id}`),
  create: (data: ServiceCreate) => api.post<Service>('/services', data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

// Staff API
export const staffApi = {
  list: () => api.get<Staff[]>('/staff'),
  get: (id: string) => api.get<Staff>(`/staff/${id}`),
  create: (data: StaffCreate) => api.post<Staff>('/staff', data),
  delete: (id: string) => api.delete(`/staff/${id}`),
};

// Clients API
export const clientsApi = {
  list: () => api.get<Client[]>('/clients'),
  get: (id: string) => api.get<Client>(`/clients/${id}`),
  create: (data: ClientCreate) => api.post<Client>('/clients', data),
  delete: (id: string, confirm: boolean) => api.delete(`/clients/${id}`, { confirm_deletion: confirm }),
};

// Working Hours API
export const workingHoursApi = {
  list: () => api.get<WorkingHours[]>('/working-hours'),
  create: (data: WorkingHoursCreate) => api.post<WorkingHours>('/working-hours', data),
  delete: (id: string) => api.delete(`/working-hours/${id}`),
};

// Time Off API
export const timeOffApi = {
  list: () => api.get<TimeOff[]>('/time-off'),
  create: (data: TimeOffCreate) => api.post<TimeOff>('/time-off', data),
  delete: (id: string) => api.delete(`/time-off/${id}`),
};

// Availability API
export const availabilityApi = {
  check: (serviceId: string, date: string, staffId?: string) => {
    const params: Record<string, string> = { service_id: serviceId, date };
    if (staffId) params.staff_id = staffId;
    return api.get<AvailabilityResponse>('/availability', params);
  },
};

// Appointments API
export const appointmentsApi = {
  get: (id: string) => api.get<Appointment>(`/appointments/${id}`),
  create: (data: AppointmentCreate) => api.post<Appointment>('/appointments', data),
  cancel: (id: string, reason?: string) => api.post<Appointment>(`/appointments/${id}/cancel`, { reason }),
  reschedule: (id: string, newStartAt: string, newStaffId?: string) =>
    api.post<Appointment>(`/appointments/${id}/reschedule`, { new_start_at: newStartAt, new_staff_id: newStaffId }),
  delete: (id: string) => api.delete(`/appointments/${id}`),
};

// Dashboard API
export const dashboardApi = {
  day: (date: string, staffId?: string) => {
    const params: Record<string, string> = { date };
    if (staffId) params.staff_id = staffId;
    return api.get<Appointment[]>('/dashboard/day', params);
  },
  summary: (days?: number) => api.get('/dashboard/summary', days ? { days: days.toString() } : undefined),
  revenue: (days?: number) => api.get('/dashboard/analytics/revenue', days ? { days: days.toString() } : undefined),
  occupancy: (days?: number) => api.get('/dashboard/analytics/occupancy', days ? { days: days.toString() } : undefined),
  serviceMix: (days?: number) => api.get('/dashboard/analytics/service-mix', days ? { days: days.toString() } : undefined),
};

// Tenant API
export const tenantApi = {
  getProfile: () => api.get<TenantProfile>('/tenant/profile'),
  updateProfile: (data: Partial<TenantProfile>) => api.patch<TenantProfile>('/tenant/profile', data),
  getSettings: () => api.get<TenantSettings>('/tenant/settings'),
  updateSettings: (data: TenantSettings) => api.patch('/tenant/settings', { settings_patch: data }),
};

// Waitlist API
export const waitlistApi = {
  list: () => api.get<Waitlist[]>('/waitlist'),
  create: (data: WaitlistCreate) => api.post<Waitlist>('/waitlist', data),
  confirm: (entryId: string) => api.post<Waitlist>(`/waitlist/${entryId}/confirm`),
  delete: (entryId: string) => api.delete(`/waitlist/${entryId}`),
};

// Conversations API
export const conversationsApi = {
  list: () => api.get('/conversations'),
  getMessages: (conversationId: string) => api.get(`/conversations/${conversationId}/messages`),
};
