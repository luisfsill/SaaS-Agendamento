/**
 * Admin API Client
 * Handles all admin HTTP requests with the X-Admin-Token header
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_RITMO_API_URL;

// Token management
export function getAdminToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('ritmo_admin_token');
}

export function setAdminToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('ritmo_admin_token', token);
    }
}

export function clearAdminToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('ritmo_admin_token');
    }
}

export function isAdminAuthenticated(): boolean {
    return !!getAdminToken();
}

// Admin API request function
export async function adminRequest<T>(
    endpoint: string,
    options: {
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
        body?: unknown;
    } = {}
): Promise<T> {
    const { method = 'GET', body } = options;
    const token = getAdminToken();

    if (!token) {
        throw new Error('Admin token not set');
    }

    if (!API_BASE_URL) {
        throw new Error('API URL not configured');
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
    };

    const requestOptions: RequestInit = {
        method,
        headers,
    };

    if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    if (!response.ok) {
        if (response.status === 401) {
            clearAdminToken();
            throw new Error('Token inválido ou expirado');
        }
        if (response.status === 503) {
            throw new Error('Área admin desabilitada no servidor');
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Erro na requisição admin');
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

// Convenience methods
export const adminApi = {
    get: <T>(endpoint: string) => adminRequest<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body?: unknown) => adminRequest<T>(endpoint, { method: 'POST', body }),
    put: <T>(endpoint: string, body?: unknown) => adminRequest<T>(endpoint, { method: 'PUT', body }),
    patch: <T>(endpoint: string, body?: unknown) => adminRequest<T>(endpoint, { method: 'PATCH', body }),
    delete: <T>(endpoint: string, body?: unknown) => adminRequest<T>(endpoint, { method: 'DELETE', body }),
};

// Validate admin token against backend
export async function validateAdminToken(token: string): Promise<boolean> {
    if (!API_BASE_URL) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/plans`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Token': token,
            },
        });
        return response.ok;
    } catch {
        return false;
    }
}
