// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/App.tsx

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

import GeneratePage from './pages/generate';
import FileGalleryPage from './pages/file-gallery';

import Home from './pages/home';

/**
 * The main application component.
 *
 * This component sets up the application's routing, authentication, theme, and overall layout.
 * It uses SolidJS's Router, ThemeProvider, AuthProvider, and Layout components to structure the application.
 *
 * @returns {JSX.Element} The rendered application component.
 */
export default function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <AuthProvider>
        <Router
          root={(props) => (
            /**
             * This is the root component of the router, providing a consistent layout across all routes.
             *
             * @param {Object} props - The props passed to the root component.
             * @param {JSX.Element} props.children - The content to be rendered within the layout.
             * @returns {JSX.Element} The layout component with the provided content.
             */
            <Layout
              title={company.name}
              menus={menus}
              content={
                /**
                 * Wraps the route content with a Suspense component to handle loading states.
                 *
                 * @param {Object} props - The props passed to the Suspense component. (implicitly passed from Router)
                 * @param {JSX.Element} props.children - The content to be rendered within the Suspense boundary.
                 * @returns {JSX.Element} The Suspense component with a fallback loading indicator.
                 */
                <Suspense fallback={<Loading backdrop={true} />}>{props.children}</Suspense>
              }
            />
          )}
        >
          {/**
           * Defines the route for the home page.
           * @path "/"
           * @component {Home}
           */}
          <Route path="/" component={Home} />

          {/**
           * Defines the route for the login page.
           * @path "/login"
           * @component {Login}
           */}
          <Route path="/login" component={Login} />

          {/**
           * Defines the route for the package tool page.
           * @path "/tools/package"
           * @component {Package}
           */}
          <Route path="/tools/package" component={Package} />

          {/**
           * Defines the route for the dashboard page, protected by authentication.
           * @path "/dashboard"
           * @component {Dashboard}
           * @protected
           */}
          <Route
            path="/dashboard"
            component={() => (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />

          {/**
           * Defines the route for the file gallery page, protected by authentication.
           * @path "/file-gallery"
           * @component {FileGalleryPage}
           * @protected
           */}
          <Route
            path="/file-gallery"
            component={() => (
              <ProtectedRoute>
                <FileGalleryPage />
              </ProtectedRoute>
            )}
          />

          {/**
           * Defines the route for the editor page, protected by authentication.
           * @path "/editor"
           * @component {Editor}
           * @protected
           */}
          <Route
            path="/editor"
            component={() => (
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            )}
          />

          {/**
           * Defines the route for the text-to-speech (TTS) form page, protected by authentication.
           * @path "/tts"
           * @component {TTSForm}
           * @protected
           */}
          <Route
            path="/tts"
            component={() => (
              <ProtectedRoute>
                <TTSForm />
              </ProtectedRoute>
            )}
          />

          {/**
           * Defines the route for the generate page, protected by authentication.
           * @path "/generate"
           * @component {GeneratePage}
           * @protected
           */}
          <Route
            path="/generate"
            component={() => (
              <ProtectedRoute>
                <GeneratePage />
              </ProtectedRoute>
            )}
          />

          {/**
           * Defines the route for the downloader page, protected by authentication.
           * @path "/downloader"
           * @component {Downloader}
           * @protected
           */}
          <Route
            path="/downloader"
            component={() => (
              <ProtectedRoute>
                <Downloader />
              </ProtectedRoute>
            )}
          />

          {/**
           * Defines a catch-all route for any undefined paths, displaying a 404 Not Found message.
           * @path "*"
           * @component {() => JSX.Element} - A simple functional component that renders the 404 message.
           */}
          <Route path="*" component={() => <div class="p-4">404 Not Found</div>} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
