
```typescript
/**
 * Title: Code Generator Component
 * Description: A SolidJS component for generating code snippets based on user prompts.
 */

import { createSignal, For } from 'solid-js';

interface CodeSnippet {
  prompt: string;
  language: string;
  topic: string;
  output: 'markdown' | 'text';
  code: string;
}

const CodeGenerator = () => {
  const [prompt, setPrompt] = createSignal('');
  const [language, setLanguage] = createSignal('typescript');
  const [topic, setTopic] = createSignal('React');
  const [output, setOutput] = createSignal<'markdown' | 'text'>('markdown');
  const [generatedCode, setGeneratedCode] = createSignal<CodeSnippet[]>([]);
  const [loading, setLoading] = createSignal(false);

  const generateCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt(),
          language: language(),
          topic: topic(),
          output: output(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedCode((prev) => [...prev, {
        prompt: prompt(),
        language: language(),
        topic: topic(),
        output: output(),
        code: data.generatedCode
      }]);
    } catch (error) {
      console.error('Failed to generate code:', error);
      alert('Failed to generate code. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="dark:bg-gray-950 dark:text-gray-100 bg-gray-100 text-gray-900 min-h-screen flex items-center justify-center">
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Code Generator</h1>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" htmlFor="prompt">Prompt:</label>
          <input
            type="text"
            id="prompt"
            class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100"
            value={prompt()}
            onInput={(e) => setPrompt((e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" htmlFor="language">Language:</label>
          <select
            id="language"
            class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100"
            value={language()}
            onChange={(e) => setLanguage((e.target as HTMLSelectElement).value)}
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" htmlFor="topic">Topic:</label>
          <input
            type="text"
            id="topic"
            class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100"
            value={topic()}
            onInput={(e) => setTopic((e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" htmlFor="output">Output Format:</label>
          <select
            id="output"
            class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100"
            value={output()}
            onChange={(e) => setOutput((e.target as HTMLSelectElement).value as 'markdown' | 'text')}
          >
            <option value="markdown">Markdown</option>
            <option value="text">Text</option>
          </select>
        </div>
        <button
          class={`dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-950 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={generateCode}
          disabled={loading()}
        >
          {loading() ? 'Generating...' : 'Generate Code'}
        </button>

        <For each={generatedCode()}>{(snippet, index) => (
          <div key={index()} class="mt-4 border rounded p-4 dark:border-gray-700">
            <h2 class="text-lg font-semibold mb-2">Generated Code</h2>
            <pre class="whitespace-pre-wrap dark:bg-gray-800 bg-gray-200 p-2 rounded">
              <code>{snippet.code}</code>
            </pre>
            <p class="text-sm mt-2">
              Prompt: {snippet.prompt} | Language: {snippet.language} | Topic: {snippet.topic} | Output: {snippet.output}
            </p>
          </div>
        )}</For>
      </div>
    </div>
  );
};

export default CodeGenerator;

/*
{
  "src": {
    "target_directory": "src/components",
    "file_name": "CodeGenerator.tsx"
  },
  "components": {
    "createSignal": "SolidJS signal for state management",
    "For": "SolidJS component for rendering lists"
  },
  "state": {
    "prompt": "Stores the user's input prompt",
    "language": "Stores the selected programming language",
    "topic": "Stores the topic for code generation",
    "output": "Stores the desired output format (markdown or text)",
    "generatedCode": "Stores the generated code snippet(s)",
    "loading": "Indicates whether code generation is in progress"
  },
  "api": {
    "endpoint": "http://localhost:3000/api/generate",
    "method": "POST",
    "payload": "JSON object containing prompt, language, topic, and output",
    "response": "JSON object containing the generated code"
  },
  "styling": {
    "framework": "Tailwind CSS",
    "dark_mode": "bg-gray-950, text-gray-100, bg-sky-600",
    "light_mode": "bg-gray-100, text-gray-900, bg-sky-950"
  },
  "error_handling": {
    "try_catch": "Handles potential errors during API request",
    "alert": "Displays an alert message to the user upon failure",
    "console_log": "Logs the error to the console for debugging"
  }
}
*/
```

```markdown
## Example Usage

To implement the generated `CodeGenerator` component in your SolidJS application, follow these steps:

1.  **Import the component:**
    ```typescript
    import CodeGenerator from './components/CodeGenerator';
    ```

2.  **Include the component in your app's JSX:**
    ```typescript jsx
    function App() {
      return (
        <div>
          <CodeGenerator />
        </div>
      );
    }

    export default App;
    ```

3.  **Ensure your NestJS API is running:**

    Make sure you have a NestJS API endpoint running at `http://localhost:3000/api/generate` that accepts POST requests with the following JSON payload:

    ```json
    {
      "prompt": "Generate code for basic React component",
      "language": "typescript",
      "topic": "React",
      "output": "markdown"
    }
    ```

    The API should respond with a JSON object containing the generated code:

    ```json
    {
      "generatedCode": "```typescript\n// Your generated React component code here\n```"
    }
    ```

This setup will allow the `CodeGenerator` component to send requests to your NestJS API and display the generated code snippets.
```




```typescript
/**
 * Title: Code Generator Component
 * Description: A SolidJS component for generating code based on user prompts.
 */

import { createSignal, For } from 'solid-js';

interface CodeGenerationRequest {
  prompt: string;
  language: string;
  topic: string;
  output: string;
}

interface CodeGenerationResponse {
  generatedCode: string;
}

const CodeGenerator = () => {
  const [prompt, setPrompt] = createSignal('');
  const [language, setLanguage] = createSignal('typescript');
  const [topic, setTopic] = createSignal('');
  const [output, setOutput] = createSignal('markdown');
  const [generatedCode, setGeneratedCode] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [history, setHistory] = createSignal<CodeGenerationRequest[]>([]);

  const languages = ['typescript', 'javascript', 'python', 'java', 'csharp'];
  const outputs = ['markdown', 'text'];

  const generateCode = async () => {
    setLoading(true);
    setError(null);

    const requestPayload: CodeGenerationRequest = {
      prompt: prompt(),
      language: language(),
      topic: topic(),
      output: output(),
    };

    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CodeGenerationResponse = await response.json();
      setGeneratedCode(data.generatedCode);

      setHistory([...history(), requestPayload]);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      setGeneratedCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="bg-gray-100 dark:bg-gray-950 min-h-screen p-4">
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-md p-6">
        <h1 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Code Generator</h1>

        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="prompt">
            Prompt:
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-800"
            id="prompt"
            type="text"
            placeholder="e.g., Generate code for basic React component"
            value={prompt()}
            onChange={(e) => setPrompt(e.currentTarget.value)}
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="language">
            Language:
          </label>
          <select
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-800"
            id="language"
            value={language()}
            onChange={(e) => setLanguage(e.currentTarget.value)}
          >
            <For each={languages}>{(lang) => <option value={lang}>{lang}</option>}</For>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="topic">
            Topic:
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-800"
            id="topic"
            type="text"
            placeholder="e.g., React, NestJS"
            value={topic()}
            onChange={(e) => setTopic(e.currentTarget.value)}
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="output">
            Output Format:
          </label>
          <select
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-800"
            id="output"
            value={output()}
            onChange={(e) => setOutput(e.currentTarget.value)}
          >
            <For each={outputs}>{(out) => <option value={out}>{out}</option>}</For>
          </select>
        </div>

        <button
          class={`bg-sky-950 dark:bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="button"
          onClick={generateCode}
          disabled={loading()}
        >
          {loading() ? 'Generating...' : 'Generate Code'}
        </button>

        {error() && (
          <div class="text-red-500 text-sm mt-2">
            Error: {error()}
          </div>
        )}

        {generatedCode() && (
          <div class="mt-6">
            <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Generated Code:</h2>
            <pre class="bg-gray-50 dark:bg-gray-800 rounded-md p-4 overflow-x-auto">
              <code class="text-gray-900 dark:text-gray-100">{generatedCode()}</code>
            </pre>
          </div>
        )}

        <div class="mt-6">
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">History:</h2>
          <ul>
            <For each={history()}>
              {(req, index) => (
                <li class="mb-2 p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                  <span class="font-bold text-gray-900 dark:text-gray-100">Request {index() + 1}:</span>
                  <div class="text-gray-700 dark:text-gray-300">
                    Prompt: {req.prompt}, Language: {req.language}, Topic: {req.topic}, Output: {req.output}
                  </div>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;

/*
{
  "src": {
    "targetDirectory": "src/components",
    "filename": "CodeGenerator.tsx"
  },
  "notes": {
    "componentDescription": "This SolidJS component provides a user interface for generating code based on a prompt, language, topic, and desired output format.  It sends a request to a NestJS API endpoint and displays the generated code.",
    "stateManagement": "Uses SolidJS signals for managing state (prompt, language, topic, output, generatedCode, loading, error, history).",
    "apiInteraction": "The `generateCode` function sends a POST request to the `/api/generate-code` endpoint with the user-provided inputs.",
    "errorHandling": "The component handles potential errors during the API request and displays an error message.",
    "uiDesign": "Styled with Tailwind CSS for a clean and responsive design.  Includes dark mode support.",
    "historyFeature": "Keeps track of previous code generation requests and displays them in a list."
  }
}
*/
```

```markdown
## Example Usage

To implement the generated `CodeGenerator` component:

1.  **Save the Code:** Save the TypeScript code as `CodeGenerator.tsx` in your `src/components` directory.
2.  **Import and Render:** Import the component into your main application file (e.g., `App.tsx`) and render it within your SolidJS application.

```typescript
// src/App.tsx
import CodeGenerator from './components/CodeGenerator';

function App() {
  return (
    <div>
      <CodeGenerator />
    </div>
  );
}

export default App;
```

3.  **Backend API:**  Ensure you have a NestJS API endpoint at `/api/generate-code` that accepts a POST request with the following body:

```json
{
  "prompt": "Generate code for basic React component",
  "language": "typescript",
  "topic": "React",
  "output": "markdown"
}
```

The API should return a JSON response with the generated code:

```json
{
  "generatedCode": "```typescript\n// Your generated React component code here\n```"
}
```
```

```json
{
  "exampleUsage": {
    "title": "CodeGenerator Component Integration",
    "description": "This markdown section provides a basic example of how to use the generated CodeGenerator component within a SolidJS application. It includes the necessary import statements and rendering instructions, as well as a description of the required backend API endpoint.",
    "steps": [
      "Save the generated TypeScript code as CodeGenerator.tsx in your src/components directory.",
      "Import the component into your main application file (e.g., App.tsx) and render it within your SolidJS application.",
      "Ensure you have a NestJS API endpoint at /api/generate-code that accepts a POST request with the specified body and returns a JSON response with the generated code."
    ]
  }
}
```


