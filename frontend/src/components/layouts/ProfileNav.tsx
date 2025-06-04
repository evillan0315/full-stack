import { Show, createSignal, onCleanup, onMount } from 'solid-js';
import { useAuth } from '../../contexts/AuthContext';

import { A, useNavigate, useLocation } from '@solidjs/router';

export function AvatarMenu() {
  const { isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = createSignal(false);
  let menuRef: HTMLDivElement | undefined;

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef && !menuRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => document.addEventListener('mousedown', handleClickOutside));
  onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/login');
  };

  const getInitial = () => (user()?.name || user()?.email || 'U')[0].toUpperCase();

  return (
    <Show
      when={isAuthenticated()}
      fallback={
        <A
          href="/login"
          class="rounded-full bg-neutral-700 p-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800"
        >
          Login
        </A>
      }
    >
      <div class="relative flex items-center">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          class="cursor-alias relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-600 bg-neutral-700 text-sm font-semibold text-white focus:outline-none"
        >
          <Show when={user()?.image} fallback={<span>{getInitial()}</span>}>
            <img src={user()?.image!} alt="Profile" class="h-full w-full object-cover" />
          </Show>
        </button>

        <Show when={isOpen()}>
          <div
            ref={menuRef}
            class="absolute top-9 right-0 z-50 mt-2 w-48 origin-top-right rounded-md border bg-gray-950 p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <A
              href="/profile"
              class="block w-full px-4 py-2 text-left text-sm text-neutral-300 rounded-md hover:bg-neutral-700 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              View Profile
            </A>
            <button
              onClick={handleLogout}
              class="block w-full px-4 py-2 text-left text-sm text-neutral-300 rounded-md hover:bg-neutral-700 hover:text-white"
            >
              Logout
            </button>
          </div>
        </Show>
      </div>
    </Show>
  );
}
