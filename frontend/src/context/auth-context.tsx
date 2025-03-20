import { createContext, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const authValue = {
    isAuthenticated: localStorage.getItem('Authorization') !== undefined,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export { AuthContext };