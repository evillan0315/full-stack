import { Show } from 'solid-js';

import { useAuth } from '../contexts/AuthContext';
import DualCodeEditor from '../components/editor/DualCodeEditor';
import Loading from '../components/Loading';

export default function Builder() {
  const { isAuthenticated } = useAuth();
  return <DualCodeEditor />;
}
