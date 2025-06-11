// src/components/layouts/Header.tsx
import Nav from './Nav';
import MobileNav from './MobileNav';
import type { MenuItem } from './types';
import { company } from '../../data/app';
import Logo from '../Logo';
import AvatarMenu from '../ui/AvatarMenu';
import { ThemeToggle } from '../ThemeToggle';
export default function Header() {
  return (
    <header class="sticky top-0 z-50 h-[3rem] flex items-center border-b bg-gray-800/10 border-gray-500/30 justify-between px-4">
      <div class="flex items-center justify-center ">
        <div class="flex-1 align-center">
          <Logo name={company.name} />
        </div>
        <nav class="hidden md:flex">
          <Nav />
        </nav>
      </div>

      <div class="md:hidden">
        <MobileNav />
      </div>
      <div class="flex items-center justify-between gap-x-4">
        <ThemeToggle />

        <AvatarMenu />
      </div>
    </header>
  );
}
