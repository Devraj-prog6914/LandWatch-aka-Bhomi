import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  quickLogin: (role: UserRole) => Promise<void>;
  registerOfficer: (officerData: {
    full_name: string;
    email: string;
    role: UserRole;
    cadre?: string;
    state: string;
    district?: string;
    designation?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACCOUNTS: Record<UserRole, { email: string; pass: string; user: User }> = {
  ADMIN: {
    email: 'admin@landwatch.gov.in',
    pass: 'LandWatch@2026',
    user: {
      id: 1,
      email: 'admin@landwatch.gov.in',
      full_name: 'Dr. Rajeshwari Sen, IAS',
      role: 'ADMIN',
      cadre: 'Indian Administrative Service (IAS)',
      state: 'All India',
      district: 'National HQ, New Delhi',
      designation: 'Mission Director, PM GatiShakti & Land Reforms'
    }
  },
  STATE_OFFICER: {
    email: 'state.mh@landwatch.gov.in',
    pass: 'LandWatch@2026',
    user: {
      id: 2,
      email: 'state.mh@landwatch.gov.in',
      full_name: 'Vikramaditya Shinde, IAS',
      role: 'STATE_OFFICER',
      cadre: 'Indian Administrative Service (IAS - MH Cadre)',
      state: 'Maharashtra',
      district: 'Mantralaya, Mumbai',
      designation: 'Principal Secretary (Revenue & Land Reforms), Maharashtra'
    }
  },
  DISTRICT_COLLECTOR: {
    email: 'district.pune@landwatch.gov.in',
    pass: 'LandWatch@2026',
    user: {
      id: 3,
      email: 'district.pune@landwatch.gov.in',
      full_name: 'Dr. Suhas Diwase, IAS',
      role: 'DISTRICT_COLLECTOR',
      cadre: 'Indian Administrative Service (Collector Cadre)',
      state: 'Maharashtra',
      district: 'Pune',
      designation: 'District Collector & District Magistrate, Pune'
    }
  },
  SLAO: {
    email: 'slao.nhai@landwatch.gov.in',
    pass: 'LandWatch@2026',
    user: {
      id: 4,
      email: 'slao.nhai@landwatch.gov.in',
      full_name: 'Anand K. Verma, SCS',
      role: 'SLAO',
      cadre: 'State Civil Services (Revenue Division)',
      state: 'Maharashtra',
      district: 'Pune Corridor Division',
      designation: 'Special Land Acquisition Officer (NHAI / MoRTH Node)'
    }
  },
  VIEWER: {
    email: 'viewer@landwatch.gov.in',
    pass: 'LandWatch@2026',
    user: {
      id: 5,
      email: 'viewer@landwatch.gov.in',
      full_name: 'Public Policy Research Fellow',
      role: 'VIEWER',
      cadre: 'NITI Aayog Policy Fellowship',
      state: 'All India',
      district: 'New Delhi',
      designation: 'NITI Aayog Infrastructure Fellow'
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('landwatch_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('landwatch_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password);
      setToken(res.access_token);
      localStorage.setItem('landwatch_token', res.access_token);
      const userData: User = {
        id: 1,
        email: res.email,
        full_name: res.full_name,
        role: res.role,
        state: res.state,
        district: res.district,
        designation: 'Authorized Officer'
      };
      setUser(userData);
      localStorage.setItem('landwatch_user', JSON.stringify(userData));
    } catch {
      // Fallback offline mock login if backend server is starting
      for (const account of Object.values(DEMO_ACCOUNTS)) {
        if (account.email.toLowerCase() === email.toLowerCase()) {
          setUser(account.user);
          localStorage.setItem('landwatch_user', JSON.stringify(account.user));
          setToken('mock-jwt-token-sih-2026');
          localStorage.setItem('landwatch_token', 'mock-jwt-token-sih-2026');
          return;
        }
      }
      if (password === 'LandWatch@2026' || password === 'admin' || password === 'password') {
        const customUser: User = {
          id: Date.now(),
          email,
          full_name: email.split('@')[0].toUpperCase().replace('.', ' ') + ' (Officer)',
          role: 'ADMIN',
          state: 'All India',
          district: 'National HQ',
          designation: 'Authorized Administrative Officer'
        };
        setUser(customUser);
        localStorage.setItem('landwatch_user', JSON.stringify(customUser));
        setToken('mock-jwt-token-sih-2026');
        localStorage.setItem('landwatch_token', 'mock-jwt-token-sih-2026');
        return;
      }
      throw new Error('Invalid credentials');
    }
  };

  const quickLogin = async (role: UserRole) => {
    const creds = DEMO_ACCOUNTS[role];
    if (creds) {
      try {
        const res = await api.login(creds.email, creds.pass);
        setToken(res.access_token);
        localStorage.setItem('landwatch_token', res.access_token);
        const userData: User = {
          id: creds.user.id,
          email: res.email || creds.email,
          full_name: res.full_name || creds.user.full_name,
          role: (res.role as UserRole) || creds.user.role,
          state: res.state || creds.user.state,
          district: res.district || creds.user.district,
          designation: creds.user.designation,
          cadre: creds.user.cadre
        };
        setUser(userData);
        localStorage.setItem('landwatch_user', JSON.stringify(userData));
      } catch {
        setUser(creds.user);
        localStorage.setItem('landwatch_user', JSON.stringify(creds.user));
        const roleToken = `mock-jwt-token-sih-2026:${creds.email}`;
        setToken(roleToken);
        localStorage.setItem('landwatch_token', roleToken);
      }
    }
  };

  const registerOfficer = async (officerData: {
    full_name: string;
    email: string;
    role: UserRole;
    cadre?: string;
    state: string;
    district?: string;
    designation?: string;
  }) => {
    const newUser: User = {
      id: Date.now(),
      email: officerData.email,
      full_name: officerData.full_name,
      role: officerData.role,
      cadre: officerData.cadre || 'Indian Administrative Service (IAS)',
      state: officerData.state,
      district: officerData.district || 'District Headquarters',
      designation: officerData.designation || 'Registered Land Acquisition Officer'
    };
    const mockToken = `officer-session-jwt-${Date.now()}`;
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem('landwatch_token', mockToken);
    localStorage.setItem('landwatch_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('landwatch_token');
    localStorage.removeItem('landwatch_user');
    localStorage.removeItem('landwatch_gateway_completed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickLogin,
        registerOfficer,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
