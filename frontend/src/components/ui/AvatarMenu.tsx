import { Show, createSignal, onCleanup, onMount } from 'solid-js';
import { useAuth } from '../../contexts/AuthContext';
import { A, useNavigate } from '@solidjs/router';
import { Button } from './Button';

export default function AvatarMenu() {
  const auth = useAuth();
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
    await auth.logout();
    setIsOpen(false);
    navigate('/login');
  };

  const getInitial = () => (auth.user()?.name || auth.user()?.email || 'U')[0].toUpperCase();

  return (
    <Show
      when={auth.isAuthenticated()}
      fallback={
        <A href="/login" class="no-underline">
          <Button variant="primary">Login</Button>
        </A>
      }
    >
      <div class="relative flex items-center">
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          class="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 text-sm font-semibold focus:outline-none"
        >
          <Show when={auth.user()?.image} fallback={<span>{getInitial()}</span>}>
            <img src={auth.user()?.image!} alt="Profile" class="h-full w-full object-cover" />
          </Show>
        </Button>

        <Show when={isOpen()}>
          <div
            ref={menuRef}
            class="absolute top-9 right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-gray-800/10 border-gray-500/30 p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
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
