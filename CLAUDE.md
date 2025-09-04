# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `yarn dev` or `npm run dev` (runs on port 5173)
- **Build for production**: `yarn build` or `npm run build` (compiles TypeScript and builds with Vite)
- **Preview production build**: `yarn preview` or `npm run preview`
- **Electron development**: `yarn electron` or `npm run electron` (starts dev server and Electron app)
- **Package Electron app**: `yarn pack` or `npm run pack` (development build)
- **Build Electron releases**: `yarn make` or `npm run make` (production build for all platforms)

## Project Architecture

### Core Technologies
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **State Management**: Zustand for global state with persistence
- **Styling**: TailwindCSS with Typography plugin
- **Desktop**: Electron for cross-platform desktop app
- **i18n**: react-i18next for internationalization
- **Markdown**: react-markdown with math support (KaTeX) and syntax highlighting

### Directory Structure
```
src/
├── api/                 # API layer (OpenAI, Google Drive sync)
├── assets/icons/        # React icon components
├── components/          # React components organized by feature
├── constants/           # Application constants
├── hooks/              # Custom React hooks
├── store/              # Zustand store slices and state management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Path Aliases
The project uses TypeScript path aliases (defined in vite.config.ts and tsconfig.json):
- `@api/*` → `./src/api/*`
- `@components/*` → `./src/components/*`
- `@store/*` → `./src/store/*`
- `@type/*` → `./src/types/*`
- `@hooks/*` → `./src/hooks/*`
- `@constants/*` → `./src/constants/*`
- `@icon/*` → `./src/assets/icons/*`
- `@utils/*` → `./src/utils/*`
- `@src/*` → `./src/*`

### State Management Architecture
Uses Zustand with multiple slices:
- `chat-slice.ts`: Chat management, messages, and folders
- `auth-slice.ts`: API key and endpoint configuration
- `config-slice.ts`: App settings and chat model configuration
- `prompt-slice.ts`: Custom prompt library management
- `input-slice.ts`: Input state and UI controls
- `toast-slice.ts`: Notification system
- `cloud-auth-slice.ts`: Google Drive sync authentication

State is persisted to localStorage with versioned migrations (currently v8).

### Key Data Models
- **ChatInterface**: Contains messages, configuration, and metadata
- **MessageInterface**: Individual chat messages with role (user/assistant/system)
- **ConfigInterface**: Model parameters (temperature, max_tokens, etc.)
- **Folder**: Chat organization with colors and hierarchy
- **ModelOptions**: Supported OpenAI models (GPT-3.5/4 variants)

### Component Architecture
- Components organized by feature (Chat, Menu, ImportExport, etc.)
- Each major component has an index.ts for clean imports
- Message rendering supports markdown, code highlighting, and LaTeX
- Responsive design with sidebar navigation and mobile support

### API Integration
- OpenAI API with configurable endpoints
- Azure OpenAI support
- Google Drive sync for cross-device chat backup
- Token counting with cost estimation
- Stream-based chat responses

### Electron Integration
- Cross-platform desktop app (Windows, macOS, Linux)
- Auto-updater integration
- Platform-specific packaging and icons
- Runs web version locally for offline access

### Development Notes
- Uses strict TypeScript configuration
- Supports both Yarn and npm package managers
- Hot reload in development
- Production builds optimize for size and performance
- Docker support available for containerized deployment