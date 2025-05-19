import { JSX } from "solid-js/jsx-runtime";
import  {Header}  from '../components/Header';
export default function Home(): JSX.Element {
  return (
    <div class="max-w-screen overflow-x-hidden">
      <div class="fixed inset-x-0 top-0 z-10 border-b border-black/5 dark:border-white/10">
        <Header />
      </div>
      <div class="grid min-h-dvh grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center pt-14.25 [--gutter-width:2.5rem] md:-mx-4 md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-2xl))_var(--gutter-width)] lg:mx-0">
        {/* Candy cane left */}
        <div class="col-start-1 row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10"></div>

        {/* Main content area */}
        <div class="grid gap-24 pb-24 text-gray-950 sm:gap-40 md:pb-40 dark:text-white">

        </div>

        {/* Candy cane right */}
        <div class="row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:col-start-3 md:block dark:[--pattern-fg:var(--color-white)]/10"></div>



        <div class="col-start-1 row-start-5 grid md:col-start-2">

        </div>
      </div>
      <div class="fixed!" aria-hidden="true">
        <input type="text" tabIndex={-1} />
      </div>
    </div>
  );
}

