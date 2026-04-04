import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ isAdmin: false, login: () => false, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const admins = [
    { username: 'abhi', password: 'Abhi123#' },
    { username: 'admin2', password: 'Admin2@123' },
    { username: 'admin3', password: 'Admin3@123' },
  ];

  const login = (username: string, password: string) => {
    const match = admins.find(a => a.username === username && a.password === password);
    if (match) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
