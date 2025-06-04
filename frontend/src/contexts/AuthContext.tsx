import { createContext, useContext, createSignal, onMount, type JSX, type Accessor } from 'solid-js';
import { createStore } from 'solid-js/store';
import api, { configureTokenGetter } from '../services/api';

interface User {
  token?: string;
  name?: string;
  email?: string;
  role?: string;
  sub?: string;
  image?: string;
}

interface AuthContextValue {
  isAuthenticated: Accessor<boolean>;
  user: Accessor<User>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>();

export const AuthProvider = (props: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean>(false);
  const [user, setUser] = createStore<User>({});

  // 🔄 Sync token to API service
  configureTokenGetter(() => user.token || localStorage.getItem('token'));

  // 🔁 Restore session from localStorage
  onMount(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser({ ...parsedUser, token });
        setIsAuthenticated(true);
      } catch {
        console.warn('Failed to parse saved user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  });

  // 🔐 Login and store token + user
  const login = async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (!response.data) throw new Error('Login failed');

    const { accessToken, user: userData } = await response.data;

    setUser({ ...userData, token: accessToken });
    setIsAuthenticated(true);

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 🚪 Logout and clear session
  const logout = () => {
    setUser({});
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user: () => user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
