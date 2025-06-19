# Project Board

A developer-focused layout system interface, implemented using TypeScript, Vite, and modern frontend technologies (React and potentially SolidJS). This project offers a highly modular and theme-aware structure, ideal for building extensible applications with sidebar navigation, a collapsible layout, and content-based routing.

---

## 📸 Screenshots

| Login Page                            | Homepage                              | Dashboard                             |
| -------------------------------------- | ------------------------------------- | -------------------------------------- |
| ![Login](./project-board-login.png)    | ![Homepage](./homepage-project-board.png) | ![Dashboard](./dashboard-screen.png)    |

---

## 📁 Project Structure

```
project-board/
├── .gitignore
├── README.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prettier.config.cjs
│
├── dist/                          # Compiled output files
│   ├── *...slug*-Dt0TiDlw\.js
│   ├── index-G72cJpw\_.js
│   ├── index.js
│   └── vscode-layout.css
│
├── libs/                          # Utility scripts
│   ├── generateStructure.ts      # Generates JSON structure of the project
│   └── generateStructureRunner.ts  # Executes the structure generator
│
├── src/                           # Application source
│   ├── App.tsx                    # Root application component
│   ├── app.css                    # Global application styles
│   │
│   ├── components/                # Reusable UI components
│   │   ├── Editor.tsx             # Code editor component (possibly using Monaco)
│   │   ├── FeatureCard.tsx        # Card component for displaying features
│   │   ├── Hero.tsx               # Hero section component
│   │   ├── Loading.tsx            # Loading indicator component
│   │   ├── LoginForm.tsx          # Login form component
│   │   ├── Logo.tsx               # Logo component
│   │   ├── MetricCard.tsx         # Card component for displaying metrics
│   │   ├── SignInWithGithub.tsx   # Sign-in with GitHub component
│   │   ├── SignInWithGoogle.tsx   # Sign-in with Google component
│   │   ├── ThemeToggle.tsx        # Component for toggling between light and dark themes
│   │   ├── docs/                  # Documentation related components
│   │   │   └── DocPageList.tsx    # Component for displaying a list of documentation pages
│   │   ├── layouts/               # Layout structure and navigation
│   │   │   ├── Footer.tsx         # Footer component
│   │   │   ├── Header.tsx         # Header component
│   │   │   ├── Layout.tsx         # Main layout component, managing overall structure
│   │   │   ├── LeftSidebar.tsx    # Left sidebar navigation component
│   │   │   ├── MobileNav.tsx      # Mobile navigation component
│   │   │   ├── Nav.tsx            # Navigation component
│   │   │   ├── RightSidebar.tsx   # Right sidebar component
│   │   │   ├── types.ts           # Type definitions for layout components
│   │   │   └── content/           # Content related components
│   │   │       ├── Content.tsx      # Main content area component
│   │   │       ├── ContentHeader.tsx # Header for the content area
│   │   │       └── ContentLayout.tsx# Layout for content pages
│   │   ├── pages/                 # Application pages
│   │   │   ├── DynamicPage.tsx    # Page component for dynamic routes with slugs
│   │   │   ├── Page.tsx           # Generic page component
│   │   │   ├── PageHeader.tsx     # Header for a page
│   │   │   └── PageSection.tsx    # Section component for structuring pages
│   │   └── routes/                # Routing related components
│   │       └── ProtectedRoute.tsx # Component for protecting routes requiring authentication
│   │
│   ├── configs/                   # Configuration files (e.g., environment variables)
│   ├── contexts/                  # React context providers
│   │   ├── AuthContext.tsx        # Authentication context provider
│   │   └── ThemeProvider.tsx      # Theme context provider
│   └── data/                      # Static data files
│       ├── app.ts                 # Application-specific data
│       └── menus.ts               # Navigation menu data
```

---

## 🔧 Key Features

- **Visual Studio Code-like Layout:**  Provides a modular and flexible UI with collapsible sidebars, header, footer, and a central content area, mimicking the familiar VS Code interface.

- **Multi-Framework Support:** Supports both React and SolidJS layout components, allowing for experimentation or gradual migration.

- **Context Management:**  Includes built-in theme and authentication context management for easy access to application state.

- **Theme Toggle:** Enables users to switch between dark and light modes using context and potentially a store for persistence.

- **Dynamic Pages:** Supports content and route-driven UIs, including advanced routing with `[slug]` and `[...slug]` parameters for flexible content management.

- **Authentication Documentation:** Offers detailed Markdown documentation for integrating OAuth providers like Google and GitHub, located within the `src/docs/authentication/` directory.

- **File Structure Generator:**  Includes a CLI-based utility (`generateStructure.ts`) to automatically generate a JSON representation of the project's file structure. This can be useful for documentation, tooling, or dynamic UI generation.

---

## 🚀 Scripts

Generate a `structure.json` file representing the current project file layout using `ts-node`:

```bash
npx ts-node libs/generateStructureRunner.ts .
```

---

## 📄 Authentication Documentation

Detailed guides for integrating with OAuth providers are located in the `src/docs/authentication/` directory:

* `google-auth-Integration.md`
* `github-auth-integration.md`

---

## 📦 Tooling & Stack

* **Language:** TypeScript
* **Bundler:** Vite
* **Frameworks:** React, SolidJS (experimental - support may vary)
* **Package Manager:** pnpm
* **UI:** Tailwind CSS
* **Context/State Management:** React Context API + custom stores (implementation details may vary)

---

## 🧠 Developer Workspace – Editor & Text-to-Speech Suite

The **Developer Workspace** is a comprehensive, web-based IDE and communication toolkit designed for developers. Built using **SolidJS**, **Tailwind CSS**, and a **Node/NestJS** backend, it integrates a powerful file editor and terminal interface with an interactive **Text-to-Speech (TTS)** engine. This suite aims to streamline coding, testing, and communication workflows.

---

## 🚀 Features Overview

### 🖥️ Editor Interface

A browser-based coding workspace providing a Visual Studio Code-like experience:

- 📁 **File Manager:**  A collapsible sidebar for browsing and selecting project files.
- ✍️ **Monaco Editor Integration:** Provides syntax highlighting, autocomplete, and rich editing features powered by the Monaco Editor.
- 📐 **Resizable Layouts:**  Dynamically adjust the dimensions of the editor and sidebar.
- 💻 **Terminal Drawer:** An embedded `xterm.js` terminal for executing shell commands directly within the workspace.
- 📦 **Server Integration:** Enables file read/write operations via REST endpoints, facilitating interaction with a backend file system.

### 🔊 Text-to-Speech (TTS)

An interactive TTS tool that converts text prompts into downloadable audio files:

- 📝 **Prompt Input:**  Allows users to enter any text message to be synthesized into speech.
- 🌍 **Language Selector:** Offers a selection of over 20 languages and dialects for speech synthesis.
- 🧑‍🎤 **Speaker Configuration:** Enables assigning voice profiles to multiple speakers for more complex audio outputs.
- 🎧 **Playback & Download:** Provides in-browser audio preview and the option to download the generated audio file locally.
- 🌐 **API-Driven:**  Powered by a RESTful `/google-tts/generate` service for handling TTS requests.

---

## 🧑‍💻 Tech Stack

### Frontend

- [SolidJS](https://solidjs.com/) – A declarative, efficient, and simple JavaScript library for building user interfaces.
- [Tailwind CSS](https://tailwindcss.com/) – A utility-first CSS framework for rapid UI development.
- [xterm.js](https://xtermjs.org/) – A fully featured terminal emulator written in JavaScript.
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) – The code editor that powers VS Code, providing advanced editing features.

### Backend

- [NestJS](https://nestjs.com/) – A progressive Node.js framework for building efficient and scalable server-side applications.
- [Google Cloud Text-to-Speech API](https://cloud.google.com/text-to-speech) – Used for converting text into natural-sounding speech.
- RESTful API for file and speech handling – Provides endpoints for file manipulation and TTS processing.

---

## 📡 Backend Setup

Verify that the following endpoints are correctly configured and functional:

* `POST /file/read` – Reads the content of a file for use in the editor.
* `POST /google-tts/generate` – Processes Text-to-Speech requests, generating audio from text.

These endpoints are typically provided by a NestJS backend. Refer to the backend repository for specific setup instructions.

---

## 🧪 Usage

### Editor

```tsx
import Editor from './pages/editor';

function App() {
  return <Editor />;
}
```

### Text-to-Speech

```tsx
import TTSForm from './components/TTSForm';

function App() {
  return <TTSForm />;
}
```

---

## 📜 Example TTS Request

```json
POST /google-tts/generate

{
  "prompt": "Hello world!",
  "languageCode": "en-US",
  "speakers": [
    { "speaker": "Eddie", "voiceName": "Kore" },
    { "speaker": "Marionette", "voiceName": "Puck" }
  ]
}
```

A successful request returns a `200 OK` response with an `audio/wav` binary file containing the synthesized audio.

---

## 🛠️ Roadmap

* [ ] Implement a toggleable terminal drawer for improved workspace organization.
* [ ] Enable TTS streaming using WebSockets for real-time audio generation.
* [ ] Add syntax-aware code analysis within the editor for enhanced code understanding.
* [ ] Provide TTS voice tone previews to allow users to sample different voice options.
* [ ] Implement theme and accessibility enhancements for a more inclusive user experience.

---

## 🤝 Contributing

Contributions are welcome!  Feel free to open an issue or submit a pull request with improvements or new features.

1. Fork the repository.
2. Create your feature branch: `git checkout -b feat/new-feature`
3. Commit your changes: `git commit -am 'feat: add new feature'`
4. Push to the branch: `git push origin feat/new-feature`
5. Open a pull request.

---

## 📄 License

MIT License © [Eddie Villanueva]

---

## 📫 Contact

For questions, suggestions, or support, please open an issue on GitHub or email [evillan0315@gmail.com](mailto:evillan0315@gmail.com)

---

## 🛠️ Planned Enhancements

*  Populate the `configs/` directory with environment and runtime configuration files.
* Expand the `stores/` and `utils/` directories with shared logic and utility functions.
* Support Server-Side Rendering (SSR) or static site generation for improved documentation performance.
* Extend the authentication system with more providers and enhanced security features.
