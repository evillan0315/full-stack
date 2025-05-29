import { createSignal, createEffect } from 'solid-js';
import { A, useLocation, useNavigate, useParams, useSearchParams } from '@solidjs/router';
import { API, useAppContext } from '../context';
import Header from '../components/Header';
interface HomeEntry {
  content: string;
}

export default function Home() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const context = useAppContext()!;
  let user;
  createEffect(async () => {
    if (!context.user()?.email) {
      console.log(context.user());
    }
  });
  return (
    <div class="flex h-screen  flex-col bg-white dark:bg-neutral-900 dark:text-white">
      <Header />
      <div class="flex-1 overflow-auto scroll-smooth px-4 py-2 text-sm" style={{ 'scroll-behavior': 'smooth' }}></div>
    </div>
  );
}
