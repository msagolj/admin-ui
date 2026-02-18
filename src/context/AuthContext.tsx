import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface LoginOption {
  name: string;
  url: string;
  icon?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loginOptions: LoginOption[];
  loginError: string | null;
  login: (url: string) => void;
  logout: () => void;
  fetchLoginOptions: () => Promise<void>;
  handleTokenSubmit: (token: string, aemToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginOptions, setLoginOptions] = useState<LoginOption[]>([]);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [aemToken, setAemToken] = useState<string | null>(null);
  const retryAfterRef = useRef<number>(0);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedAemToken = localStorage.getItem('aemToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    if (storedAemToken) {
      setAemToken(storedAemToken);
    }
  }, []);

  const fetchLoginOptions = useCallback(async () => {
    const now = Date.now();
    if (retryAfterRef.current > now) {
      const waitSeconds = Math.ceil((retryAfterRef.current - now) / 1000);
      setLoginError(`Rate limited. Please retry after ${waitSeconds}s.`);
      return;
    }

    setLoginError(null);

    try {
      const response = await fetch('https://admin.hlx.page/login', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const retryAfter = response.headers.get('x-retry-after') || response.headers.get('retry-after');
        if (retryAfter) {
          const retrySeconds = parseInt(retryAfter, 10);
          if (!isNaN(retrySeconds) && retrySeconds > 0) {
            retryAfterRef.current = Date.now() + retrySeconds * 1000;
            setLoginError(`Rate limited. Please retry after ${retrySeconds}s.`);
            return;
          }
        }

        if (response.status === 429) {
          const defaultRetry = 60;
          retryAfterRef.current = Date.now() + defaultRetry * 1000;
          setLoginError(`Rate limited. Please retry after ${defaultRetry}s.`);
          return;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.links) {
        setLoginOptions([]);
        return;
      }
      
      const options = Object.entries(data.links)
        .filter(([key]) => !key.toLowerCase().endsWith('sa'))
        .map(([key, url]) => {
          const name = key.replace('login_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          let icon = '';
          
          if (name.toLowerCase().includes('google')) {
            icon = 'https://www.google.com/favicon.ico';
          } else if (name.toLowerCase().includes('microsoft')) {
            icon = 'https://www.microsoft.com/favicon.ico';
          } else if (name.toLowerCase().includes('adobe')) {
            icon = 'https://www.adobe.com/favicon.ico';
          }
          
          return {
            name,
            url: url as string,
            icon
          };
        });
      
      setLoginOptions(options);
    } catch (error) {
      console.error('Failed to fetch login options:', error);
      setLoginError('Failed to fetch login options.');
    }
  }, []);

  const login = (url: string) => {
    // Open login URL in a new tab
    window.open(url, '_blank');
  };

  const handleTokenSubmit = (newToken: string, newAemToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    setIsAuthenticated(true);
    
    if (newAemToken) {
      setAemToken(newAemToken);
      localStorage.setItem('aemToken', newAemToken);
    }
  };

  const logout = () => {
    setToken(null);
    setAemToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('aemToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginOptions,
        loginError,
        login,
        logout,
        fetchLoginOptions,
        handleTokenSubmit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 