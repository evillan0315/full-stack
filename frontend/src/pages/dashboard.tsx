import { createSignal, createEffect } from 'solid-js';
import { A, useLocation, useNavigate, useParams } from '@solidjs/router';
import { API, useAppContext } from '../context';

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

  return <div class="flex min-h-screen items-center justify-center"></div>;
}
