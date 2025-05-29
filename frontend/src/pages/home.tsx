import { createSignal, createEffect } from 'solid-js';
import { A, useLocation, useNavigate, useParams, useSearchParams } from '@solidjs/router';
import { API, useAppContext } from '../context';
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
  return <div class="flex min-h-screen items-center justify-center"></div>;
}
