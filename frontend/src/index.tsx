// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/index.tsx

import { render } from 'solid-js/web';
import './index.css';
import App from './App.tsx';

//import ThemeProvider from './contexts/ThemeProvider';

/**
 * The root element where the SolidJS application will be rendered.
 * It's retrieved from the DOM using its ID.  A non-null assertion operator (!) is used
 * because the render function expects a non-null element.  It is assumed that the HTML
 * contains an element with the id 'app'.  If it doesn't, this will cause a runtime error.
 */
const root = document.getElementById('app');

/**
 * Renders the main application component (`App`) into the specified root element.
 *
 * This is the entry point for the SolidJS application. It initializes the application
 * by mounting the `App` component onto the DOM. The `render` function from `solid-js/web`
 * takes a function that returns a JSX component and a DOM element as arguments.
 *
 * @param {() => JSX.Element} () => <App /> - A function that returns the root component (`App`) to be rendered. This function is a thunk to enable Solid's reactivity to properly track dependencies.
 * @param {HTMLElement} root! - The DOM element where the application will be mounted.  The non-null assertion operator (!) is used because the render function expects a non-null element.  If `root` is null, this will result in a runtime error.
 * @returns {void}
 *
 * @example
 * // Assuming an HTML file with an element: <div id="app"></div>
 * render(() => <App />, document.getElementById('app')!);
 */
render(() => <App />, root!);
