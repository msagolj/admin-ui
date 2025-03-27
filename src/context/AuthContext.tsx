import React, { createContext, useContext, useState, useEffect } from 'react';

interface LoginOption {
  name: string;
  url: string;
  icon?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loginOptions: LoginOption[];
  login: (url: string) => void;
  logout: () => void;
  fetchLoginOptions: () => Promise<void>;
  handleTokenSubmit: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginOptions, setLoginOptions] = useState<LoginOption[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchLoginOptions = async () => {
    try {
      const response = await fetch('https://admin.hlx.page/login', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Login options response:', data); // Debug log
      
      if (!data.links) {
        console.error('No links found in response:', data);
        setLoginOptions([]);
        return;
      }
      
      // Convert the links object into an array of login options
      const options = Object.entries(data.links)
        .filter(([key]) => !key.toLowerCase().endsWith('sa'))
        .map(([key, url]) => {
          const name = key.replace('login_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          let icon = '';
          
          // Set icon based on the login provider
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
      
      console.log('Processed login options:', options); // Debug log
      setLoginOptions(options);
    } catch (error) {
      console.error('Failed to fetch login options:', error);
      setLoginOptions([]);
    }
  };

  const login = (url: string) => {
    // Open login URL in a new window
    window.open(url, 'login', 'width=600,height=800');
  };

  const handleTokenSubmit = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginOptions,
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