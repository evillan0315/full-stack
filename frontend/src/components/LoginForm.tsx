import { createSignal, Show } from 'solid-js';
import { type JSX } from 'solid-js';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '@solidjs/router';
import Loading from './Loading';
import SignInWithGoogle from './SignInWithGoogle';
import SignInWithGithub from './SignInWithGithub';

/**
 * LoginForm component provides a user interface for signing in with email and password.
 * It utilizes the AuthContext for authentication and the Solid Router for navigation.
 *
 * @returns {JSX.Element} A SolidJS component representing the login form.
 */
export default function LoginForm(): JSX.Element {
  /**
   * Accesses the login function from the AuthContext.
   */
  const { login } = useAuth();

  /**
   * Accesses the navigation function from the Solid Router.
   */
  const navigate = useNavigate();

  /**
   * `username` signal stores the user's email address input.
   */
  const [username, setUsername] = createSignal('');

  /**
   * `password` signal stores the user's password input.
   */
  const [password, setPassword] = createSignal('');

  /**
   * `error` signal stores any error message that occurs during the login process.
   * It is initialized to `null`.
   */
  const [error, setError] = createSignal<string | null>(null);

  /**
   * `loading` signal indicates whether the login process is currently in progress.
   * It is used to display a loading indicator.
   */
  const [loading, setLoading] = createSignal(false);

  /**
   * Handles the form submission.  It prevents the default form submission behavior,
   * sets the `loading` signal to `true`, attempts to log in the user, and navigates
   * to the dashboard on success.  If an error occurs, it sets the `error` signal
   * with the error message.  Finally, it sets the `loading` signal to `false`.
   *
   * @param {Event} e The form submission event.
   */
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email: username(), password: password() });

      // If login succeeds, navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Show when={!loading()} fallback={<Loading />}>
      <div class="py-16">
        <div class="flex items-center justify-center">
          <div class="w-full max-w-md rounded-lg p-8 border shadow-lg">
            <h2 class="text-center text-2xl font-bold">Welcome Back 👋</h2>
            {error() && <p class="text-center text-sm text-red-400">{error()}</p>}
            <form class="space-y-4 mt-4" onSubmit={handleSubmit}>
              <div>
                <label class="block">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  class="mt-1 w-full rounded-md border p-3 focus:ring-2 focus:ring-blue-500"
                  value={username()}
                  onInput={(e) => setUsername(e.currentTarget.value)}
                  required
                />
              </div>
              <div>
                <label class="block">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  class="mt-1 w-full rounded-md border p-3 focus:ring-2 focus:ring-blue-500"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full rounded-md bg-sky-500 p-3 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
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
}
