import { createSignal, For } from "solid-js";

interface SchemaFormProps {
  schema: Record<string, any>; // JSON schema
  onSubmit: (data: Record<string, any>) => void;
}

export default function SchemaForm(props: SchemaFormProps) {
  const [formData, setFormData] = createSignal<Record<string, any>>({});

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData(), [key]: value });
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  const properties = () => props.schema.properties || {};
  const requiredFields = new Set(props.schema.required || []);

  return (
    <form onSubmit={handleSubmit} class="space-y-4 max-w-2xl mx-auto p-4">
      <For each={Object.entries(properties())}>
        {([key, field]) => (
          <div class="flex flex-col space-y-1">
            <label for={key} class="font-medium">
              {key} {requiredFields.has(key) && <span class="text-red-500">*</span>}
            </label>
            {field.type === "string" && (
              <input
                type="text"
                id={key}
                name={key}
                required={requiredFields.has(key)}
                class="border px-2 py-1 rounded"
                onInput={(e) => handleChange(key, e.currentTarget.value)}
              />
            )}
            {field.type === "number" && (
              <input
                type="number"
                id={key}
                name={key}
                required={requiredFields.has(key)}
                class="border px-2 py-1 rounded"
                onInput={(e) => handleChange(key, parseFloat(e.currentTarget.value))}
              />
            )}
            {field.type === "boolean" && (
              <input
                type="checkbox"
                id={key}
                name={key}
                class="w-5 h-5"
                onChange={(e) => handleChange(key, e.currentTarget.checked)}
              />
            )}
          </div>
        )}
      </For>

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Data
      </button>
    </form>
  );
}

