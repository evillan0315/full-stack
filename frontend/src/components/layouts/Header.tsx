// src/components/layouts/Header.tsx
import Nav from './Nav';
import MobileNav from './MobileNav';
import type { MenuItem } from './types';
import { company } from '../../data/app';
import Logo from '../Logo';
import { AvatarMenu } from './ProfileNav';
import { ThemeToggle } from '../ThemeToggle';
export default function Header() {
  return (
    <header class="sticky top-0 z-50 h-[3rem] flex items-center border-b border-gray-800/50 dark:bg-gray-950/10 justify-between px-4">
      <div class="flex align-center justify-center ">
        <div class="flex-1 align-center">
          <Logo name={company.name} />
        </div>
        <nav class="hidden md:flex p-2">
          <Nav />
        </nav>
      </div>

      <div class="md:hidden">
        <MobileNav />
      </div>
      <div class="flex align-center justify-between gap-x-4">
        <div class="mt-1">
          <ThemeToggle />
        </div>
        <AvatarMenu />
      </div>
    </header>
  );
}
