import { createSignal, createEffect } from 'solid-js';
import { A, useLocation, useNavigate, useParams } from '@solidjs/router';
import { API, useAppContext } from '../context';
import Header from '../components/Header';
interface DashboardEntry {
  content: string;
}

export default function Dashboard() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const context = useAppContext()!;

  createEffect(() => {
    if (!context.user()?.email) {
      navigate(`/login`);
    }
  });

  return (
    <div class="flex h-screen  flex-col bg-white dark:bg-neutral-900 dark:text-white">
      <Header />
      <h1 class="leading-0 uppercase tracking-widest text-lg mt-6 px-4">
        <b>Dash</b>board
      </h1>
      <div class="flex-1 overflow-auto scroll-smooth px-4 py-2 text-sm" style={{ 'scroll-behavior': 'smooth' }}></div>
    </div>
  );
}
