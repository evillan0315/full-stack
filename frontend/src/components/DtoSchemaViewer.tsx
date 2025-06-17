import { createResource, createSignal, Show, For } from 'solid-js';

const apiBase = '/json-dto'; // Adjust if your API prefix differs

export default function DtoSchemaViewer() {
  const [selectedDto, setSelectedDto] = createSignal<string | null>(null);

  // Fetch DTO list
  const [dtoList] = createResource(async () => {
    const res = await fetch(`${apiBase}/list`);
    if (!res.ok) throw new Error('Failed to fetch DTO list');
    return res.json() as Promise<string[]>;
  });

  // Fetch schema when DTO is selected
  const [schema] = createResource(selectedDto, async (dto) => {
    if (!dto) return null;
    const res = await fetch(`${apiBase}/schema?dto=${encodeURIComponent(dto)}`);
    if (!res.ok) throw new Error(`Failed to fetch schema for ${dto}`);
    return res.json();
  });

  return (
    <div class="p-4 space-y-4">
      <h2 class="text-xl font-bold">DTO Schema Viewer</h2>

      {/* DTO selector */}
      <Show when={!dtoList.loading} fallback={<div>Loading DTO list...</div>}>
        <select
          class="border rounded p-2"
          onInput={(e) => setSelectedDto(e.currentTarget.value)}
        >
          <option value="">Select DTO</option>
          <For each={dtoList()}>
            {(dto) => (
              <option value={dto}>{dto}</option>
            )}
          </For>
        </select>
      </Show>

      {/* Schema output */}
      <Show
        when={schema()}
        fallback={
          <Show when={schema.loading}>
            <div>Loading schema...</div>
          </Show>
        }
      >
        {(data) => (
          <pre class="bg-gray-100 p-2 rounded overflow-auto text-sm">
            {JSON.stringify(data.schema, null, 2)}
          </pre>
        )}
      </Show>

      {/* Error handling */}
      <Show when={dtoList.error}>
        <div class="text-red-600">Error: {dtoList.error.message}</div>
      </Show>
      <Show when={schema.error}>
        <div class="text-red-600">Error: {schema.error.message}</div>
      </Show>
    </div>
  );
}

