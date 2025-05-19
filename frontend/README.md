# Cognito Auth SolidJS Frontend

This is a SolidJS version of the Cognito Auth Frontend application, built with:

- [SolidJS](https://www.solidjs.com/) - A declarative, efficient, and flexible JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Solid Router](https://github.com/solidjs/solid-router) - Routing for SolidJS
- [TanStack Query](https://tanstack.com/query/latest) - Powerful asynchronous state management for SolidJS

## Features

- User authentication with AWS Cognito
- Protected routes
- Dashboard with service cards
- EC2 instance management
- RDS instance management
- PostgreSQL database management

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd cognito-auth-solidjs
npm install
```

3. Create a `.env` file in the root directory with the following content:

```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── common/       # Common UI components like Button, Card, etc.
├── hooks/            # Custom hooks for data fetching and state management
├── pages/            # Page components
├── services/         # API services
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
```

## Building for Production

To build the application for production, run:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License.
