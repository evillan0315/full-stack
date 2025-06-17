
```typescript
/**
 * Title: Code Stripper Service and Controller with SolidJS Frontend
 * Description: A NestJS service and controller for stripping code blocks from text and saving them to files, along with a SolidJS frontend for interacting with the API.
 */

// src/code-stripper/code-stripper.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CodeStripperService {
  async stripAndSave(text: string): Promise<string[]> {
    const codeBlocks = this.extractCodeBlocks(text);
    const filePaths = await this.saveCodeBlocks(codeBlocks);
    return filePaths;
  }

  private extractCodeBlocks(text: string): { language: string; code: string }[] {
    const regex = /```(\w+)\n([\s\S]*?)```/g;
    const matches = [...text.matchAll(regex)];
    return matches.map((match) => ({
      language: match[1],
      code: match[2].trim(),
    }));
  }

  private async saveCodeBlocks(
    codeBlocks: { language: string; code: string }[],
  ): Promise<string[]> {
    const filePaths: string[] = [];
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });

    for (let i = 0; i < codeBlocks.length; i++) {
      const { language, code } = codeBlocks[i];
      const filename = `code-${i + 1}.${language}`;
      const filePath = path.join(outputDir, filename);
      await fs.writeFile(filePath, code);
      filePaths.push(filename);
    }
    return filePaths;
  }
}

// src/code-stripper/code-stripper.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CodeStripperService } from './code-stripper.service';

@Controller('code-stripper')
export class CodeStripperController {
  constructor(private readonly codeStripperService: CodeStripperService) {}

  @Post('strip')
  async stripCode(@Body() body: { text: string }): Promise<{ filePaths: string[] }> {
    try {
      const filePaths = await this.codeStripperService.stripAndSave(body.text);
      return { filePaths };
    } catch (error) {
      throw new HttpException('Failed to strip and save code', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

// src/code-stripper/code-stripper.module.ts
import { Module } from '@nestjs/common';
import { CodeStripperService } from './code-stripper.service';
import { CodeStripperController } from './code-stripper.controller';

@Module({
  controllers: [CodeStripperController],
  providers: [CodeStripperService],
})
export class CodeStripperModule {}

// src/app.module.ts
import { Module } from '@nestjs/common';
import { CodeStripperModule } from './code-stripper/code-stripper.module';

@Module({
  imports: [CodeStripperModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

// frontend/src/App.tsx
import { createSignal, createEffect } from 'solid-js';

function App() {
  const [text, setText] = createSignal('');
  const [filePaths, setFilePaths] = createSignal<string[]>([]);
  const [error, setError] = createSignal('');
  const [darkMode, setDarkMode] = createSignal(false);

  createEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  });

  const toggleDarkMode = () => {
    if (darkMode()) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };


  const handleStripCode = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:3000/code-stripper/strip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to strip code.');
        return;
      }

      const data = await response.json();
      setFilePaths(data.filePaths);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div class={`min-h-screen transition-colors duration-500 ${darkMode() ? 'bg-gray-950 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div class="container mx-auto p-4">
        <header class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Code Stripper</h1>
          <button onClick={toggleDarkMode} class={`p-2 rounded-md transition-colors duration-300 ${darkMode() ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-950 hover:bg-sky-900'} text-white`}>
            {darkMode() ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>
        <main>
          <div class="mb-4">
            <label for="codeText" class="block text-sm font-medium mb-2">Enter Code with Blocks:</label>
            <textarea
              id="codeText"
              class={`shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md transition-colors duration-300 ${darkMode() ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              rows={10}
              value={text()}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button
            onClick={handleStripCode}
            class={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${darkMode() ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'bg-sky-950 hover:bg-sky-900 text-white'}`}
          >
            Strip Code
          </button>
          {error() && (
            <div class="mt-4 text-red-500">
              Error: {error()}
            </div>
          )}
          {filePaths().length > 0 && (
            <div class="mt-6">
              <h2 class="text-lg font-semibold mb-2">Extracted Files:</h2>
              <ul>
                {filePaths().map((filePath) => (
                  <li key={filePath} class="mb-1">
                    {filePath}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
        <footer class="mt-8 text-center text-gray-500">
          <p>&copy; 2024 Code Stripper</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
```

```json
{
  "notes": {
    "general": "This code provides a complete solution, including a NestJS API and a SolidJS frontend for stripping code blocks and saving them as separate files.",
    "nestjs": {
      "structure": "The NestJS application is structured with modules, controllers, and services, following best practices for maintainability and scalability.",
      "codeStripperService": "The `CodeStripperService` contains the core logic for extracting code blocks using regular expressions and saving them to files.",
      "codeStripperController": "The `CodeStripperController` exposes an API endpoint for triggering the code stripping process.",
      "appModule": "The `AppModule` imports the `CodeStripperModule` to make the feature available.",
      "errorHandling": "Basic error handling is implemented in the controller to catch exceptions and return appropriate HTTP responses."
    },
    "solidjs": {
      "functionality": "The SolidJS frontend provides a user interface for inputting text with code blocks and displaying the extracted file paths.",
      "ui": "The UI includes a text area for input, a button to trigger the stripping process, and a list to display the generated file names.",
      "styling": "Tailwind CSS is used for styling the frontend, providing a modern and responsive design.",
      "darkMode": "Dark mode is implemented using Tailwind CSS and local storage to persist the user's preference.",
      "apiIntegration": "The frontend sends a POST request to the NestJS API endpoint to strip the code blocks.",
      "errorDisplay": "Error messages from the API are displayed to the user in case of failure.",
      "fileList": "The list of generated file paths is displayed after successful code stripping.",
      "stateManagement": "SolidJS's signals are used for state management, making the UI reactive and efficient.",
      "initialState": "The app uses browser `localStorage` and `prefers-color-scheme` to determine the initial dark mode state.",
      "toggling": "The dark mode toggle button correctly toggles between light and dark modes, storing the user's preference in `localStorage`."
    },
    "directory_structure": {
      "src": {
        "code-stripper": {
          "code-stripper.service.ts": "Contains the logic for stripping code blocks and saving them to files.",
          "code-stripper.controller.ts": "Handles the API endpoint for stripping code blocks.",
          "code-stripper.module.ts": "Defines the module for the code stripper feature."
        },
        "app.module.ts": "The root module of the NestJS application."
      },
      "frontend": {
        "src": {
          "App.tsx": "The main component of the SolidJS frontend."
        }
      }
    },
    "dependencies": {
      "nestjs": [
        "@nestjs/common",
        "@nestjs/core",
        "@nestjs/platform-express",
        "reflect-metadata",
        "rxjs"
      ],
      "solidjs": [
        "solid-js"
      ],
      "utility": [
        "fs",
        "path"
      ],
      "dev_dependencies": [
        "typescript",
        "@types/node",
        "tailwindcss",
        "postcss",
        "autoprefixer"
      ]
    },
    "deployment": {
      "nestjs": "Build the NestJS application using `npm run build` and deploy it to a Node.js server.",
      "solidjs": "Build the SolidJS frontend using `npm run build` and deploy the static files to a web server or CDN.",
      "cors": "Ensure that CORS is properly configured in the NestJS application to allow requests from the SolidJS frontend."
    }
  }
}
```

```markdown
## Example Usage

### Implementing the Code Stripper

This example outlines how to implement the generated NestJS API and SolidJS frontend for stripping code blocks and saving them as files.

1.  **Set up the NestJS API:**
    *   Create a new NestJS project.
    *   Copy the `src/code-stripper` folder and `src/app.module.ts` into your project.
    *   Install the necessary dependencies (as listed in the `dependencies` and `dev_dependencies` sections in the json above).
    *   Start the NestJS application. Ensure that the API is accessible on `http://localhost:3000`.

2.  **Set up the SolidJS Frontend:**
    *   Create a new SolidJS project using `npx degit solidjs/templates/js my-app`.
    *   Replace the contents of `src/App.tsx` with the generated SolidJS code.
    *   Install Tailwind CSS and its dependencies by following the official Tailwind CSS installation guide.

        ```bash
        npm install -D tailwindcss postcss autoprefixer
        npx tailwindcss init -p
        ```

        Configure Tailwind by adding the following to the `tailwind.config.js` file.

        ```javascript
        /** @type {import('tailwindcss').Config} */
        module.exports = {
        content: [
            "./src/**/*.{js,jsx,ts,tsx}",
        ],
        darkMode: 'class', // or 'media' or 'class'
        theme: {
            extend: {},
        },
        plugins: [],
        }
        ```

        Add the Tailwind directives to your CSS file. (e.g., `src/index.css`)

        ```css
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        ```
    *   Install the SolidJS dependencies.
    *   Start the SolidJS development server.  The frontend should be accessible on `http://localhost:3000`. If the NestJS server is running on the same port, you'll need to adjust either the frontend's or backend's port.

3.  **Testing the Application:**
    *   Enter text containing code blocks in the textarea on the frontend.
    *   Click the "Strip Code" button.
    *   If successful, the file paths of the extracted code blocks will be displayed. The files will be saved in the `output` directory within your NestJS project.

```

````bash
#!/bin/bash

# Title: Markdown Code Block Extractor with Grouped Output (Safe Version)
# Description: Extracts code blocks from a Markdown file and saves each block
#              into output/<language>/<language>-<index>.<ext> files.

INPUT_FILE="$1"
OUTPUT_ROOT="output"

if [[ -z "$INPUT_FILE" ]]; then
  echo "Usage: $0 <input-markdown-file>"
  exit 1
fi

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "Error: File '$INPUT_FILE' not found."
  exit 1
fi

mkdir -p "$OUTPUT_ROOT"

# Create a temporary file to collect each block and language info
TMP_FILE=$(mktemp)

# Extract code blocks using awk and save to temp file with separator
awk '
  BEGIN { in_block = 0; lang = "plain" }
  /^```/ {
    if (in_block) {
      print "__END_BLOCK__"
      in_block = 0
    } else {
      lang = substr($0, 4)
      if (lang == "") lang = "plain"
      print "__START_BLOCK__ " lang
      in_block = 1
    }
    next
  }
  {
    if (in_block) print
  }
' "$INPUT_FILE" > "$TMP_FILE"

# Now process the temp file and save to appropriate files
LANG=""
INDEX_MAP=()

while IFS= read -r line; do
  if [[ "$line" == __START_BLOCK__* ]]; then
    LANG="${line#__START_BLOCK__ }"
    DIR="$OUTPUT_ROOT/$LANG"
    mkdir -p "$DIR"

    if [[ -z "${INDEX_MAP[$LANG]}" ]]; then
      INDEX_MAP[$LANG]=1
    else
      INDEX_MAP[$LANG]=$((INDEX_MAP[$LANG]+1))
    fi

    EXT="txt"
    case "$LANG" in
      typescript) EXT="ts" ;;
      javascript) EXT="js" ;;
      bash|shell) EXT="sh" ;;
      python) EXT="py" ;;
      html) EXT="html" ;;
      css) EXT="css" ;;
      json) EXT="json" ;;
      markdown|md) EXT="md" ;;
    esac

    FILE="$DIR/${LANG}-${INDEX_MAP[$LANG]}.$EXT"
    : > "$FILE"
  elif [[ "$line" == __END_BLOCK__ ]]; then
    echo "Saved: $FILE"
  else
    echo "$line" >> "$FILE"
  fi
done < "$TMP_FILE"

rm "$TMP_FILE"
````

---

### ✅ Example Usage:

```bash
chmod +x extract_md_code_grouped.sh
./extract_md_code_grouped.sh ../docs/Code\ Block\ Stripper.md
```



```bash
Saved: output/typescript/typescript-1.ts
Saved: output/bash/bash-1.sh
Saved: output/plain/plain-1.txt
...
```

````md
# Example Usage

```bash
./extract_md_code_grouped.sh ../docs/Code\ Block\ Stripper.md
````

Where the input Markdown file contains:
\`\`\`typescript
// example code
\`\`\`
\`\`\`bash

# script

\`\`\`

## Description

* This script extracts all code blocks from the Markdown file.
* Each block is saved under `output/<language>/<language>-<index>.<ext>`.
* Auto-creates output directories and sequentially numbers files.
* Supports: `typescript`, `javascript`, `bash`, `shell`, `python`, `html`, `css`, `json`, `markdown`, `md`; defaults to `txt`.

```


