import { Show, createSignal, onCleanup, onMount } from 'solid-js';
import { useAuth } from '../../contexts/AuthContext';
import { A, useNavigate } from '@solidjs/router';

import { Button } from '../ui/Button'; // Adjust path as needed

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
        <A href="/login" class="no-underline">
          <Button variant="secondary">Login</Button>
        </A>
      }
    >
      <div class="relative flex items-center justify-center">
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          variant="primary"
          class="rounded-full w-8 h-8 "
          aria-label="Toggle menu"
        >
          <Show when={user()?.image} fallback={<span class="text-gray-950">{getInitial()}</span>}>
            <img src={user()?.image!} alt="Profile" class="h-full w-full object-cover" />
          </Show>
        </Button>

        <Show when={isOpen()}>
          <div
            ref={menuRef}
            class="absolute top-9 right-0 z-50 mt-2 w-60 origin-top-right rounded-md border bg-gray-800/20 border-gray-500/30 p-4 shadow-lg transition"
          >
            <div class="flex h-full flex-col justify-between space-y-4">
              <div class="flex flex-col space-y-2">
                <A href="/profile" onClick={() => setIsOpen(false)} class="">
                  View Profile
                </A>
              </div>

              <Button onClick={handleLogout} class="w-full">
                Logout
              </Button>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
}
