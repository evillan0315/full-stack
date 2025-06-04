import { For, Show } from 'solid-js';
import { company } from '../../data/app';
import type { MenuItem } from './types';

interface FooterProps {
  links: MenuItem[];
}

const Footer = (props: FooterProps) => {
  return (
    <footer
      class="sticky bottom-0 z-50 h-[2rem] flex items-center border-t bg-gray-500/10 border-gray-800/50 justify-between px-4
    
    "
    >
      <div class="flex items-center justify-start">
        <p>© 2025 {company.name}. All rights reserved.</p>
        <nav class="lg:flex lg:gap-x-6 ml-4">
          <For each={props.links}>
            {(link) => (
              <Show when={link.show}>
                <a
                  class="hover:text-blue-600 dark:hover:text-blue-400"
                  href={link.slug === 'home' ? '/' : `/${link.slug}`}
                >
                  {link.title}
                </a>
              </Show>
            )}
          </For>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
