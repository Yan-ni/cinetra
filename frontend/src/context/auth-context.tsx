import { createContext, ReactNode, useState, useEffect } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    updateAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  updateAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('Authorization') !== null
  );

  const updateAuth = () => {
    setIsAuthenticated(localStorage.getItem('Authorization') !== null);
  };

  useEffect(() => {
    // Check authentication status on mount and when localStorage changes
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('Authorization') !== null);
    };
    
    checkAuth();
    
    // Listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, updateAuth }}>{children}</AuthContext.Provider>;
}

export { AuthContext };