import Dismiss from 'solid-dismiss';
import { A, useNavigate } from '@solidjs/router';
import { Icon } from 'solid-heroicons';

import { onCleanup, createSignal, Show, Component, createEffect } from 'solid-js';

import {
  share,
  link,
  arrowDownTray,
  xCircle,
  bars_3,
  moon,
  sun,
  commandLine,
  computerDesktop,
  arrowRight,
  userCircle,
  cube,
  lockClosed,
  rocketLaunch,
  cog,
  codeBracket,
  speakerWave,
} from 'solid-heroicons/outline';

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
  function openInternalLink(url: string) {
    window.location.href = url;
    //navigate('/profile');
  }
  function openProfile() {
    window.location.href = '/profile';
    //navigate('/profile');
  }
  function openApi() {
    window.location.href = '/api';
  }
  function openSettings() {
    window.location.href = '/settings';
    //navigate('/settings');
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
    <header class="dark:bg-neutral-900 border-b z-12 sticky top-0 flex items-center bg-white gap-x-4 border-slate-200 p-0 px-2 text-sm dark:border-neutral-700 mb-0 inset-1">
      {props.children || (
        <>
          <button
            onClick={() => openInternalLink('/')}
            class="flex cursor-alias flex-row items-center space-x-2 rounded px-2 py-2 opacity-80 hover:opacity-100 md:px-1"
          >
            <h1 class="leading-0 uppercase tracking-widest flex items-center gap-2 text-left">
              <Icon path={cube} class="h-6" /> <b>Project</b> Board
            </h1>
          </button>
          <button
            class="flex cursor-alias items-center gap-2 px-2 py-2 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500 leading-0 uppercase tracking-widest"
            onClick={() => openInternalLink('/dashboard')}
          >
            <Icon path={computerDesktop} class="h-6" /> Dashboard
          </button>
          <button
            class="flex cursor-alias items-center gap-2 px-2 py-2 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500  leading-0 uppercase tracking-widest"
            onClick={() => openInternalLink('/editor')}
          >
            <Icon path={codeBracket} class="h-6" /> Editor
          </button>
          <button
            class="flex cursor-alias items-center gap-2 px-2 py-2 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500 leading-0 uppercase tracking-widest"
            onClick={() => openInternalLink('/tts')}
          >
            <Icon path={speakerWave} class="h-6" /> TTS
          </button>
        </>
      )}
      <div
        class="ml-auto md:flex md:flex-row md:items-center md:space-x-2"
        menuButton={() => menuBtnEl}
        open={showMenu}
        setOpen={setShowMenu}
        show
      >
        <Show when={isAuthenticated()}>
          <button
            class="flex cursor-alias items-center gap-2 px-2 py-2 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500 leading-0 uppercase tracking-widest"
            onClick={() => openInternalLink('/dashboard')}
          >
            <Icon path={sun} class="h-6" />
          </button>
          
        </Show>
      </div>
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
            <button
              onClick={() => openInternalLink('/login')}
              class="flex cursor-alias flex-row items-center gap-2 rounded px-2 py-1 opacity-80 hover:opacity-100 md:px-1 border border-neutral-600 rounded-md "
            >
              <Icon path={lockClosed} class="h-6" /> Login
            </button>
          }
        >
          <button ref={profileBtn} class="cursor-alias hidden md:block">
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
            <div class="dark:bg-neutral-900 absolute right-0 flex flex-col items-left justify-center bg-neutral-100 rounded-lg w-60 border border-neutral-600 dark:text-neutral-100 shadow-lg">
              {' '}
              {/* Set width here */}
              <div
                class="flex space-x-3 px-2 py-4 border-b border-neutral-600"
                onClick={() => openInternalLink('/profile')}
              >
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
                    <span class="text-xs text-gray-600 dark:text-gray-400 capitalize">
                      {context.user()?.role || 'Member'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                class="flex cursor-alias items-center gap-2 px-4 py-2 text-left text-neutral-100 hover:bg-neutral-800"
                onClick={() => openInternalLink('/settings')}
              >
                <Icon path={cog} class="h-7" /> Settings
              </button>
              <button
                class="flex cursor-alias items-center gap-2 px-4 py-2 text-left text-neutral-100 hover:bg-neutral-800"
                onClick={() => openInternalLink('/api')}
              >
                <Icon path={rocketLaunch} class="h-7" /> API Documentation
              </button>
              <button
                class="flex cursor-alias items-center gap-2 px-4 py-2 text-left text-neutral-100 hover:bg-neutral-800"
                onClick={() => openInternalLink('/logout')}
              >
                <Icon path={arrowRight} class="h-7" /> Logout
              </button>
            </div>
          </Dismiss>
        </Show>
      </div>
    </header>
  );
};

export default Header;
