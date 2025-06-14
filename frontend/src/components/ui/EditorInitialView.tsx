import { type Component, For } from 'solid-js';
//import { renderToString } from 'solid-js/web';
import { editor, features } from '../../data/app';
import FeatureCard from '../FeatureCard';

const EditorInitialView: Component = () => {
  return (
    <div class="h-screen flex flex-col overflow-auto relative">
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">{editor.title}</h1>
        <p class="mb-4">{editor.description}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <For each={features}>
            {(feature) => <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />}
          </For>
        </div>
      </div>
    </div>
  );
};

export default EditorInitialView;
