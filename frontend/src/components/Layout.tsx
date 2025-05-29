import { Component, JSX, Show, createEffect, createResource, createSignal, For, Suspense } from 'solid-js';
import { A, useLocation, useNavigate, useParams } from '@solidjs/router';
import { API, useAppContext } from '../context';
import Header from './Header';
interface LayoutProps {
  children: JSX.Element;
  isAuthenticated: boolean;
  footer?: string;
}

const Layout: Component<LayoutProps> = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const context = useAppContext()!;
  return (
    <div class="max-w-screen overflow-x-hidden">
      <div class="fixed inset-x-0 top-0 z-10 border-b border-black/5 dark:border-white/10">
        <div class="bg-white dark:bg-neutral-950">
          <Header />
        </div>
      </div>

      <main class="h-screen overflow-hidden">
        <div class="grid grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center pt-10.25 [--gutter-width:2.5rem] md:-mx-4 md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-2xl))_var(--gutter-width)] lg:mx-0">
          <div class="col-start-1 row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] border-neutral-200 dark:border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10"></div>

          {props.children}

          <div class="row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] border-neutral-200 dark:border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:col-start-3 md:block dark:[--pattern-fg:var(--color-white)]/10"></div>
        </div>

        <div class="fixed!" aria-hidden="true">
          <input type="text" tabIndex={-1} />
        </div>
      </main>

      <Show when={props.footer}>
        <footer>
          <p>&copy; 2025 {props.footer}</p>
        </footer>
      </Show>
    </div>
  );
};

export default Layout;
