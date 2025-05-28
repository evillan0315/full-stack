import { JSX } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import Terminal from './pages/terminal';
const App = (): JSX.Element => {
  return (
    <div class="dark:bg-solid-darkbg relative flex h-screen flex-col overflow-auto bg-white font-sans text-slate-900 dark:text-slate-50">
      <Router>
        <Route path="/terminal" component={Terminal} />
        <Route path="/" component={Terminal} />
      </Router>
    </div>
  );
};

export default App;
