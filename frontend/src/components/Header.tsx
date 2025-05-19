// Header.tsx


import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { IconButton } from "./IconButton";


function Logo(props: JSX.IntrinsicElements["svg"]) {
  return <svg {...props} />;
}

function GitHubLogo(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path d="..." />
    </svg>
  );
}




export function Header() {
  const [navIsOpen, setNavIsOpen] = createSignal(false);
  const navigate = useNavigate();

  return (
    <div class="bg-white dark:bg-gray-950">
      <div class="flex h-14 items-center justify-between gap-8 px-4 sm:px-6">
        <div class="flex items-center gap-4">
          <A
            href="/"
            class="shrink-0"
            aria-label="Home"
            onContextMenu={(e) => {
              e.preventDefault();
              navigate("/brand");
            }}
          >
            <Logo class="h-5 text-black dark:text-white" />
          </A>
 
        </div>

        <div class="flex items-center gap-6 max-md:hidden">
 
          <A href="/docs" class="text-sm/6 text-gray-950 dark:text-white">Docs</A>
          <A href="/blog" class="text-sm/6 text-gray-950 dark:text-white">Blog</A>
          <A href="/showcase" class="text-sm/6 text-gray-950 dark:text-white">Showcase</A>
          <a href="/plus?ref=top" class="group relative px-1.5 text-sm/6 text-sky-800 dark:text-sky-300">
            <span class="absolute inset-0 border ... bg-sky-400/10 group-hover:bg-sky-400/15" />
            Plus
            {/* Add corner SVGs */}
          </a>
          <a href="https://github.com/tailwindlabs/tailwindcss" aria-label="GitHub repository">
            <GitHubLogo class="size-5 fill-black/40 dark:fill-gray-400" />
          </a>
        </div>

        <div class="flex items-center gap-2.5 md:hidden">
 
          <IconButton aria-label="Navigation" onClick={() => setNavIsOpen(!navIsOpen())}>
            <svg viewBox="0 0 16 16" fill="currentColor" class="size-4">
              <path d="..." />
            </svg>
          </IconButton>

        </div>
      </div>
    </div>
  );
}

