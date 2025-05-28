## 📁 Project Name: Bash AI

### 🧠 Description

**Smart Terminal AI** is an intelligent, web-based terminal interface powered by NestJS and SolidJS, integrated with state-of-the-art AI models like **ChatGPT** and **Google Gemini**. This smart terminal allows users to interact with system commands, code snippets, and AI assistance in real-time—blending traditional shell-like functionality with natural language processing capabilities.

Ideal for developers, tech educators, and productivity enthusiasts, this platform streamlines command execution, automates troubleshooting, and acts as your AI-powered development assistant.

---

## 🚀 Features

### 💻 Terminal Interface

- Interactive smart terminal in the browser (built with **SolidJS**)
- Supports basic shell commands (via backend)
- Context-aware command suggestions
- Autocomplete and history tracking

### 🤖 AI Assistant Integration

- Use **ChatGPT** for natural language prompts, debugging help, and code generation
- Tap into **Google Gemini** for advanced reasoning, document analysis, and multi-modal interactions
- AI-powered command completion and shell explanation
- Multi-language support for development and DevOps

### 🔐 Authentication

- OAuth2 with AWS Cognito (Google login support)
- Role-based access control (RBAC)

### 📡 Realtime Communication

- WebSocket-powered live command streaming
- Live terminal feedback and AI interactions

### 🗃️ Backend Services

- NestJS REST & WebSocket APIs
- Secure command execution environment
- Custom command & script management
- AI prompt pipelines with retry and memory

### 📄 Documentation

- Swagger API documentation with full CRUD operations for commands and sessions
- CLI tools for developer automation

---

## 📦 Tech Stack

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| Frontend    | SolidJS, TailwindCSS, TypeScript      |
| Backend     | NestJS, WebSocket, Prisma, TypeScript |
| AI Services | OpenAI (ChatGPT), Google Gemini       |
| Auth        | AWS Cognito + OAuth2 (Google)         |
| Realtime    | WebSocket (NestJS Gateway)            |
| Database    | PostgreSQL or DynamoDB (configurable) |
| Deployment  | Docker, AWS EC2 / Lambda              |

---

## 📁 Folder Structure

```bash
smart-terminal-ai/
├── apps/
│   ├── frontend/           # SolidJS terminal UI
│   └── backend/            # NestJS API + WebSocket
├── packages/
│   ├── ai-sdk/             # Unified AI interface for OpenAI/Gemini
│   └── shared/             # Shared types & utilities
├── docker/
│   └── nginx/              # Optional reverse proxy setup
├── prisma/                 # Prisma schema
├── .env                    # Environment variables
└── README.md
```

---

## ⚙️ Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/smart-terminal-ai.git
cd smart-terminal-ai

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Run backend
pnpm --filter backend dev

# Run frontend
pnpm --filter frontend dev
```

---

## 🔐 Authentication Setup

Configure AWS Cognito:

1. Create a Cognito User Pool + Google Identity Provider.
2. Update `.env` with Cognito and Google client credentials.
3. Use provided `/auth` endpoints to login via Google.

---

## ✨ AI Integration Setup

- **ChatGPT (OpenAI)**: Add your `OPENAI_API_KEY` to `.env`
- **Google Gemini**: Add your `GOOGLE_API_KEY`

You can switch between AI models using config or user preferences.

---

## 🛠️ Future Roadmap

- 🧩 Plugin system for custom commands/scripts
- 📜 AI memory & session-based context
- 🧠 Auto-correct and AI explanations for command errors
- 🧪 Unit + E2E tests for all modules
- 🔌 CLI companion for local terminal usage

---

## 🧑‍💻 Author

**Eddie Villanueva**  
[GitHub](https://github.com/evillan0315) | [LinkedIn](https://www.linkedin.com/in/evillanueva0315) | [Email](mailto:evillan0315@gmail.com)

---

## 📝 License

This project is licensed under the MIT License.

---

Would you like me to generate the repo structure and starter files as well, sugar?
