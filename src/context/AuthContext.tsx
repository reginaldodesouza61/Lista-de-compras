import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  signIn: () => void;
  signOut: () => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  signIn: () => {},
  signOut: () => {},
  accessToken: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Carrega o script do Google Identity Services e recupera do localStorage
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Recupera dados do localStorage ao iniciar
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsAuthenticated(true);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Função para login
  const signIn = () => {
    if (!(window as any).google) {
      toast.error('Google Identity Services não carregado.');
      return;
    }

    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: '101232726860-et5m7uj9jarg1iunh5jpf74a4c2bq5mc.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile openid email',
      callback: (tokenResponse: any) => {
        if (tokenResponse && tokenResponse.access_token) {
          setAccessToken(tokenResponse.access_token);
          setIsAuthenticated(true);
          localStorage.setItem('accessToken', tokenResponse.access_token); // Salva token
          fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          })
            .then((res) => res.json())
            .then((profile) => {
              setUser(profile);
              localStorage.setItem('user', JSON.stringify(profile)); // Salva user
            });
          toast.success('Login realizado com sucesso!');
        } else {
          toast.error('Falha ao autenticar com o Google.');
        }
      },
    });

    client.requestAccessToken();
  };

  // Função para logout
  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);