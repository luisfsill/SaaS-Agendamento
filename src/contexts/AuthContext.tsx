import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, TokenPair, LoginRequest, RegisterRequest, tenantApi, TenantProfile } from '@/lib/api';

interface User {
  email: string;
  tenant?: TenantProfile;
}

interface AuthContextType {
  user: User | null;
  tenant: TenantProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshTenant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<TenantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveTokens = (tokens: TokenPair) => {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  };

  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const fetchTenant = useCallback(async () => {
    try {
      const profile = await tenantApi.getProfile();
      setTenant(profile);
      return profile;
    } catch {
      return null;
    }
  }, []);

  const refreshTenant = useCallback(async () => {
    await fetchTenant();
  }, [fetchTenant]);

  const initAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const profile = await fetchTenant();
        if (profile) {
          setUser({ email: '', tenant: profile });
        }
      } catch {
        clearTokens();
      }
    }
    setIsLoading(false);
  }, [fetchTenant]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (data: LoginRequest) => {
    const tokens = await authApi.login(data);
    saveTokens(tokens);
    const profile = await fetchTenant();
    setUser({ email: data.email, tenant: profile || undefined });
  };

  const register = async (data: RegisterRequest) => {
    const tokens = await authApi.register(data);
    saveTokens(tokens);
    const profile = await fetchTenant();
    setUser({ email: data.email, tenant: profile || undefined });
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setTenant(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
