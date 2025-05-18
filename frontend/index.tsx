import { render } from 'solid-js/web';

const App = () => {
  return <button onClick={() => alert('Hello from SolidJS!')}>Click Me</button>;
};

render(() => <App />, document.getElementById('solid-root')!);
