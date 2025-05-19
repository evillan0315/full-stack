import { createSignal, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

export default function SignInWithGoogle() {
  const [loginUrl, setLoginUrl] = createSignal('');

  onMount(() => {
    //if (COGNITO_DOMAIN && CLIENT_ID && REDIRECT_URI) {
    setLoginUrl(`http://localhost:5000/api/auth/google`);
    //}
  });

  return (
    <button
      onClick={() => loginUrl() && (window.location.href = loginUrl())}
      class="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gray-700 p-3 text-white hover:bg-gray-600"
    >
      <Icon icon="flat-color-icons:google" width="20" height="20" /> Sign in with Google
    </button>
  );
}
