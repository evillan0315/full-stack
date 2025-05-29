import Dismiss from 'solid-dismiss';
import { A, useNavigate } from '@solidjs/router';
import { Icon } from 'solid-heroicons';

import { onCleanup, createSignal, Show, Component, createEffect } from 'solid-js';

import { share, link, arrowDownTray, xCircle, bars_3, moon, sun, commandLine } from 'solid-heroicons/outline';

import { API, useAppContext } from '../context';

interface HeaderProps {}
const Header: Component<HeaderProps> = (props) => {
  const [copy, setCopy] = createSignal(false);
  const context = useAppContext()!;
  const [showMenu, setShowMenu] = createSignal(false);
  const [showProfile, setShowProfile] = createSignal(false);
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [userImage, setUserImage] = createSignal('');
  let menuBtnEl!: HTMLButtonElement;
  let profileBtn!: HTMLButtonElement;
  const navigate = useNavigate();

  function shareLink() {
    props.share().then((url) => {
      navigator.clipboard.writeText(url).then(() => {
        setCopy(true);
        setTimeout(setCopy, 750, false);
      });
    });
  }

  window.addEventListener('resize', closeMobileMenu);
  onCleanup(() => {
    window.removeEventListener('resize', closeMobileMenu);
  });

  function closeMobileMenu() {
    setShowMenu(false);
  }
  createEffect(async () => {
    if (context.user()?.email) {
      if (context.user()?.image) {
        setUserImage(context.user()?.image);
      }
      setIsAuthenticated(true); // Set based on user existence
    }
  });
  const signOut = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      
      // Redirect to login page
      location.reload();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <header class="dark:bg-neutral-950 border-b-2px z-12 sticky top-0 flex items-center bg-white gap-x-4 border-slate-200 p-1 px-2 text-sm dark:border-neutral-800">
      {props.children || (
        <h1 class="leading-0 uppercase tracking-widest">
          <b>Code</b> Playground
        </h1>
      )}
      <Dismiss
        classList={{
          'absolute top-[53px] right-[10px] w-[fit-content] z-10': showMenu(),
          'shadow-md flex flex-col justify-center bg-white dark:bg-solid-darkbg': showMenu(),
          'hidden': !showMenu(),
        }}
        class="ml-auto md:flex md:flex-row md:items-center md:space-x-2"
        menuButton={() => menuBtnEl}
        open={showMenu}
        setOpen={setShowMenu}
        show
      >
        <a
          href="/terminal"
          class="flex cursor-alias flex-row items-center space-x-2 rounded px-2 py-2 opacity-80 hover:opacity-100 md:px-1"
          title="Terminal"
        >
          <Icon path={commandLine} class="h-6" />
        </a>
      </Dismiss>
      <button
        type="button"
        classList={{
          'border-white border': showMenu(),
        }}
        class="visible relative ml-auto rounded px-3 py-2 opacity-80 hover:opacity-100 md:hidden"
        title="Mobile Menu Button"
        ref={menuBtnEl}
      >
        <Show when={showMenu()} fallback={<Icon path={bars_3} class="h-6 w-6" />}>
          <Icon path={xCircle} class="h-[22px] w-[22px]" /* adjusted to account for border */ />
        </Show>
        <span class="sr-only">Show menu</span>
      </button>

      <div class="relative h-8 cursor-pointer leading-snug">
        <Show
          when={isAuthenticated()}
          fallback={
            <a class="bg-solid-default mx-1 rounded px-3 py-2 text-lg text-slate-50" href={`/login`} rel="external">
              Login
            </a>
          }
        >
          <button ref={profileBtn}>
            {/** Store user image in a variable so we only call it once */}
            <Show
              when={context.user()?.image}
              fallback={
                <div class="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase">
                  {context.user()?.name?.[0] || context.user()?.email?.[0] || 'U'}
                </div>
              }
            >
              <img
                src={`${API}/file/proxy?url=${encodeURIComponent(context.user()?.image || '')}`}
                class="h-8 w-8 rounded-full"
                alt={context.user()?.name}
                crossOrigin="anonymous"
              />
            </Show>
          </button>

          <Dismiss menuButton={() => profileBtn} open={showProfile} setOpen={setShowProfile}>
            <div class="dark:bg-neutral-950 absolute right-0 flex flex-col items-left justify-center bg-white shadow-md rounded-lg p-4 w-60">
              {' '}
              {/* Set width here */}
              <div class="flex space-x-3">
                {' '}
                {/* Added flex for inline */}
                <Show
                  when={context.user()?.image}
                  fallback={
                    <div class="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase border-2 border-gray-200 dark:border-gray-600 shadow-md">
                      {context.user()?.name?.[0] || context.user()?.email?.[0] || 'U'}
                    </div>
                  }
                >
                  <img
                    src={`${API}/file/proxy?url=${encodeURIComponent(context.user()?.image || '')}`}
                    class="h-10 w-10 rounded-full border-`1 border-neutral-200 dark:border-neutral-600 shadow-md"
                    alt={context.user()?.name}
                    crossOrigin="anonymous"
                  />
                </Show>
                <div class="text-left">
                  {' '}
                  {/* Ensures text aligns properly with avatar */}
                  <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {context.user()?.name || context.user()?.email || 'User'} <br />
                    <span class="text-xs text-gray-600 dark:text-gray-400 capitalize">{context.user()?.role || 'Member'}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={signOut}
                class="w-full px-2 py-2 text-left text-xs hover:bg-gray-300 dark:hover:bg-gray-800 rounded-md mt-2"
              >
                Sign Out
              </button>
            </div>
          </Dismiss>
        </Show>
      </div>
    </header>
  );
};

export default Header;
