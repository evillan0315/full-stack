import { Component, createSignal } from 'solid-js';
//import { useNavigate, useLocation } from '@solidjs/router';
import { createForm } from '@felte/solid';
import { Icon } from '@iconify-icon/solid';
import  ContentCard  from '../components/common/ContentCard';
import SignInWithGoogle from '../components/signInWithGoogle';
import SignInWithGithub from '../components/signInWithGithub';
import api from '../services/api';

interface LoginFormData {
  email: string;
  password: string;
}

export const Login: Component = () => {
 
  const [error, setError] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);
  // Redirect if already authenticated

  const { form } = createForm<LoginFormData>({
    onSubmit: async (values) => {
      console.log(values);
       const {email, password} = values;
      try {
        const response = await api.post('/api/auth/login', { email, password });
        const { accessToken } = response.data;
        

        //const from = location.state?.from?.pathname || '/dashboard';
        //navigate(from, { replace: true });
        
        setIsLoading(false);
        // Navigation will happen in the createEffect above
      } catch (err: any) {
        setError(err.message || 'Failed to login');
        setIsLoading(false);
      }
    },
  });

  return (
    <div class="flex min-h-screen items-center justify-center">
      <div class="w-full max-w-md">
        <ContentCard>
          <form ref={form} class="space-y-6">
            {error() && (
              <div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
                {error()}
              </div>
            )}

            <div>
              <label for="email" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label for="password" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading()}
                class="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-800 p-3 text-gray-200 hover:bg-gray-600"
              >
                <Icon icon="mdi:login" width="24" class="text-gray-900" height="24" />{' '}
                {isLoading() ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            <SignInWithGoogle />
            <SignInWithGithub />
          </form>
        </ContentCard>

        <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Not a member?{' '}
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login ;
