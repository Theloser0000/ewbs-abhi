import { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isAdmin: boolean;
  isHead: boolean;
  adminUsername: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  isHead: false,
  adminUsername: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHead, setIsHead] = useState(false);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    const { data, error } = await supabase
      .from('admins')
      .select('username, role')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (error || !data) return false;

    setIsAdmin(true);
    setIsHead(data.role === 'head');
    setAdminUsername(data.username);
    return true;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsHead(false);
    setAdminUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isHead, adminUsername, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
