import { Router, Route } from '@solidjs/router';
import { Suspense } from 'solid-js';

import Layout from './components/layouts/Layout';
import Loading from './components/Loading';
import './app.css';

import { menus } from './data/menus';
import { company } from './data/app';

import ThemeProvider from './contexts/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import Toaster from './components/Toaster';

import Package from './pages/tools/package';
import Login from './pages/login';
import Editor from './pages/editor';
import TTSForm from './pages/tts';
import Downloader from './pages/downloader';
import Dashboard from './pages/dashboard';
import FileGalleryPage from './pages/file-gallery';

import Home from './pages/home';

export default function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <AuthProvider>
        <Router
          root={(props) => (
            <Layout
              title={company.name}
              menus={menus}
              content={<Suspense fallback={<Loading />}>{props.children}</Suspense>}
            />
          )}
        >
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />

          <Route path="/tools/package" component={Package} />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            component={() => (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/file-gallery"
            component={() => (
              <ProtectedRoute>
                <FileGalleryPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/editor"
            component={() => (
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tts"
            component={() => (
              <ProtectedRoute>
                <TTSForm />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/downloader"
            component={() => (
              <ProtectedRoute>
                <Downloader />
              </ProtectedRoute>
            )}
          />

          {/* Catch-all */}
          <Route path="*" component={() => <div class="p-4">404 Not Found</div>} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
