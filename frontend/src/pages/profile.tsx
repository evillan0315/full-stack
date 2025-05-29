import { createSignal, createEffect } from 'solid-js';
import { A, useLocation, useNavigate, useParams } from '@solidjs/router';
import { API, useAppContext } from '../context';
import Header from '../components/Header';
interface ProfileProps {
  content: string;
}

export default function Profile() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const context = useAppContext()!;

  return (
    <div class="flex h-screen  flex-col bg-white dark:bg-neutral-900 dark:text-white">
      <Header />
      <h1 class="leading-0 uppercase tracking-widest text-lg mt-6 px-4">
        <b>Manage</b> Profile
      </h1>
      <div class="flex-1 overflow-auto scroll-smooth px-4 py-2 text-sm" style={{ 'scroll-behavior': 'smooth' }}></div>
    </div>
  );
}
