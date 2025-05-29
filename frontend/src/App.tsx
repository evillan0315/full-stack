import { Show, JSX, Suspense } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import Layout from './components/Layout';
import Terminal from './pages/terminal';
import Dashboard from './pages/dashboard';
import Home from './pages/home';
import Login from './pages/login';

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
      <Route path="/login" component={() => <Login />} />
    </Router>
  );
};

export default App;
