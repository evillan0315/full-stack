import { Show, JSX, Suspense } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import Layout from './components/Layout';
import Terminal from './pages/terminal';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import Profile from './pages/profile';
import Home from './pages/home';
import Login from './pages/login';
import Logout from './pages/logout';
import CodeEditor from './pages/codeEditor';
import TTSForm from './pages/ttsForm';
import Toaster from './components/Toaster';
import { AppContextProvider } from './context';

const App = (): JSX.Element => {
  const isAuthenticated = false; // Replace with actual auth logic
  const footer = 'Your Company';

  return (
    <Router
      root={(props) => (
        <AppContextProvider>
          <Suspense>{props.children}</Suspense>
        </AppContextProvider>
      )}
    >
      {/* Wrap each page in Layout manually */}

      <Route
        path="/"
        component={() => (
          <Layout isAuthenticated={isAuthenticated}>
            <Home />
          </Layout>
        )}
      />
      <Route
        path="/dashboard"
        component={() => (
          <Layout isAuthenticated={isAuthenticated}>
            <Dashboard />
          </Layout>
        )}
      />
      <Route
        path="/terminal"
        component={() => (
          <Layout isAuthenticated={isAuthenticated}>
            <Terminal />
          </Layout>
        )}
      />
      <Route
        path="/settings"
        component={() => (
          <Layout isAuthenticated={isAuthenticated}>
            <Settings />
          </Layout>
        )}
      />
      <Route
        path="/profile"
        component={() => (
          <Layout isAuthenticated={isAuthenticated}>
            <Profile />
          </Layout>
        )}
      />
      <Route
        path="/tts"
        component={() => (
          <Layout isAuthenticated={isAuthenticated}>
            <TTSForm />
          </Layout>
        )}
      />
      <Route
        path="/editor"
        component={() => (
          <>
            <Toaster />
            <CodeEditor />
          </>
        )}
      />
      <Route path="/logout" component={() => <Logout />} />
      <Route path="/login" component={() => <Login />} />
    </Router>
  );
};

export default App;
