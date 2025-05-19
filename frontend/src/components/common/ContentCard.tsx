import { JSX, Component, Show} from 'solid-js';

const ContentCard: Component<{
  children: JSX.Element;
  title?: string;
  class?: string;
}> = (props) => {
  return (
    <div
      class={`overflow-hidden rounded-lg border border-neutral-700 bg-white shadow dark:bg-neutral-800 ${props.class || ''}`}
    >
      <Show when={props.title}>
        <div class="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <h3 class="text-lg font-medium text-neutral-900 dark:text-white">{props.title}</h3>
        </div>
      </Show>
      <div class="px-6 py-5">{props.children}</div>
    </div>
  );
};

export default ContentCard;
