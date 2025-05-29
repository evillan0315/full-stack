import { Navigate, useSearchParams, useParams, useLocation, Route, Routes, useNavigate } from '@solidjs/router';
import { createSignal, For, Show, createEffect } from 'solid-js';
import { API, useAppContext } from '../context';
import { Icon } from '@iconify-icon/solid';
import SignInWithGoogle from '../components/SignInWithGoogle';
import SignInWithGithub from '../components/SignInWithGithub';
const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const icons: Record<string, string> = {
    js: 'vscode-icons:file-type-js',
    jsx: 'tabler:file-type-jsx',
    ts: 'vscode-icons:file-type-typescript',
    tsx: 'tabler:file-type-tsx',
    json: 'vscode-icons:file-type-json',
    html: 'vscode-icons:file-type-html',
    css: 'vscode-icons:file-type-css',
    md: 'lineicons:markdown',
    py: 'vscode-icons:file-type-python',
    java: 'vscode-icons:file-type-java',
    cpp: 'vscode-icons:file-type-cpp',
    cs: 'vscode-icons:file-type-csharp',
    php: 'vscode-icons:file-type-php',
    default: 'vscode-icons:file',
  };
  return icons[extension || 'default'];
};

const Loading = () => (
  <div class="bg-solid-darkbg fixed inset-0 flex items-center justify-center">
    <svg
      class="m-auto h-12 w-12 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

const LoginComponent = () => {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();
  const context = useAppContext()!;
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: username(), password: password() }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // More informative error
        setError(errorText || response.statusText);
        throw new Error(errorText || response.statusText);
      }

      const data = await response.json();
      if (data) {
        localStorage.setItem('token', data.accessToken);
        location.reload();
        navigate(`/dashboard`);
      } else {
        throw new Error('AccessToken not found in response');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Show when={!loading()} fallback={<Loading />}>
      <div class="bg-white dark:bg-neutral-900 h-screen w-full">
        <div class="flex min-h-screen items-center justify-center">
          <div class="w-full max-w-md rounded-lg bg-neutral-950 p-8 border border-neutral-300 dark:border-neutral-600 shadow-lg">
            <h2 class="text-center text-2xl font-bold text-white">Welcome Back 👋</h2>
            {error() && <p class="text-center text-sm text-red-400">{error()}</p>}
            <form class="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label class="block text-gray-400">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  class="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-800 p-3 text-neutral-900 dark:text-neutral-100  placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"
                  value={username()}
                  onInput={(e) => setUsername(e.currentTarget.value)}
                />
              </div>
              <div>
                <label class="block text-gray-400">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  class="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-800 p-3 text-neutral-900 dark:text-neutral-100  placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                />
              </div>
              <button
                type="submit"
                class="w-full rounded-md bg-blue-600 p-3 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Sign In
              </button>
            </form>
            <SignInWithGoogle />
            <SignInWithGithub />
          </div>
        </div>
      </div>
    </Show>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const localuser = localStorage.getItem('user');
  const context = useAppContext()!;
  let user;
  createEffect(() => {
    if (context.user()?.email) {
      navigate('/dashboard');
    }
  });

  return (
    <div class="dark:bg-solid-darkbg fixed inset-0 flex items-center justify-center">
      <LoginComponent />
    </div>
  );
};

export default Login;
