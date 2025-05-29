import { JSX } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import Terminal from './pages/terminal';
import Dashboard from './pages/dashboard';
import Home from './pages/home';
const App = (): JSX.Element => {
  return (
    <div class="relative flex h-full flex-col bg-white dark:bg-neutral-900 font-sans text-slate-900 dark:text-slate-50">
      <Router>
        <Route path="/terminal" component={Terminal} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/" component={Home} />
      </Router>
    </div>
  );
};

export default App;
