import { Accessor, createContext, createResource, createSignal, ParentComponent, Resource, useContext } from 'solid-js';
import type { Tab } from 'solid-repl';
import { isDarkTheme } from './utils/isDarkTheme';
import { useNavigate } from '@solidjs/router';
type User = {
  name: string;
  image: string;
  email: string;
};
interface AppContextType {
  token: string;
  user: Resource<User | undefined>;
  tabs: Accessor<Tab[] | undefined>;
  setTabs: (x: Accessor<Tab[] | undefined> | undefined) => void;
  dark: Accessor<boolean>;
  toggleDark: () => void;
  files: Accessor<FileNode[]>;
  refreshFiles: () => Promise<void>;
}

type FileNode = {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path?: string;
  content?: string;
};

const AppContext = createContext<AppContextType>();

export const API = `${import.meta.env.BASE_URL}/api`;

export const AppContextProvider: ParentComponent = (props) => {
  const navigate = useNavigate();
  const [token, setToken] = createSignal(localStorage.getItem('token') || '');
  const [files, setFiles] = createSignal<FileNode[]>([]);
  const [dark, setDark] = createSignal(isDarkTheme());

  // Fetch user data
  const [user] = createResource(token, async (token) => {
    //if (!token) return { email: '', name: '', image: '' };
    const localuser = localStorage.getItem('user');

    if (localuser) {
      return JSON.parse(localuser);
    }
    const result = await fetch(`${API}/auth/me`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!result.ok) {
      if (result.status === 401) {
        //navigate('/login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return { email: '', name: '', image: '' };
    }

    const iuser = await result.json();
    localStorage.setItem('user', JSON.stringify(iuser));
    return iuser;
  });

  // Fetch folder structure
  const refreshFiles = async () => {
    try {
      const result = await fetch(`${API}/file/list?directory=./&recursive=true`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!result.ok) {
        if (result.status === 401) {
          //navigate('/login');
          localStorage.removeItem('token');
        }
        return {};
      }
      if (result.ok) {
        const body: FileNode[] = await result.json();
        setFiles(body);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  // Initial file load
  refreshFiles();

  let [tabsGetter, setTabs] = createSignal<Accessor<Tab[] | undefined>>();

  return (
    <AppContext.Provider
      value={{
        get token() {
          return token();
        },
        set token(x) {
          setToken(x);
          localStorage.setItem('token', x);
        },
        user,
        tabs() {
          const tabs = tabsGetter();
          return tabs ? tabs() : undefined;
        },
        setTabs(x) {
          setTabs(() => x);
        },
        dark,
        toggleDark() {
          let x = !dark();
          document.body.classList.toggle('dark', x);
          setDark(x);
          localStorage.setItem('dark', String(x));
        },
        files,
        refreshFiles,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
