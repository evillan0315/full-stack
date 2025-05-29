import { Component, JSX, Show, createEffect, createResource, createSignal, For, Suspense } from 'solid-js';
import { A, useLocation, useNavigate, useParams } from '@solidjs/router';
import { API, useAppContext } from '../context';

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
    <div class="flex h-screen flex-col overflow-hidden">
      <main class="flex-1">
        <div class="grid grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center [--gutter-width:2.5rem] md:-mx-4 md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-2xl))_var(--gutter-width)] lg:mx-0">
          <div class="col-start-1 row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] border-neutral-200 dark:border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10"></div>
          <div class="">{props.children}</div>
          <div class="row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] border-neutral-200 dark:border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:col-start-3 md:block dark:[--pattern-fg:var(--color-white)]/10"></div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
