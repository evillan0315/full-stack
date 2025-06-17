import { type Component, createSignal, onMount, onCleanup, Show } from 'solid-js';
import Header from './Header';
import { Footer } from './Footer';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import CommandPalette from './CommandPalette';
import { createConfirmModal } from '../ui/ConfirmModal';
import ModalSettings from './ModalSettings';
import type { MenuItem } from './types';

interface LayoutProps {
  title: string;
  menus: MenuItem[];
  content: JSX.Element;
  header?: JSX.Element;
  stickyHeader?: boolean;
  leftSidebar?: boolean;
  rightSidebar?: boolean;
  leftFooter?: boolean;
  rightFooter?: boolean;
  middleFooter?: boolean;
}

export default function Layout({
  title,
  menus,
  content,
  header,
  stickyHeader = false,
  leftSidebar = false,
  rightSidebar = false,
  leftFooter = true,
  middleFooter = false,
  rightFooter = false,
}: LayoutProps) {
  return (
    <div class="flex flex-col h-screen">
      <Show when={header}>{header}</Show>
      {content}
      <Footer left={leftFooter} middle={middleFooter} right={rightFooter} />
      <CommandPalette />
      <ModalSettings />
    </div>
  );
}
