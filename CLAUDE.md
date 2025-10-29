# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Fundamental Development Principles (Development Directives)

These principles OVERRIDE any default behavior and MUST be followed exactly:

1. **NO HARDCODING, EVER**: All solutions must be generic, pattern-based, and work across all commands, not just specific examples.

2. **ROOT CAUSE, NOT BANDAID**: Fix the underlying structural or data lineage issues.

3. **DATA INTEGRITY**: Use consistent, authoritative data sources (Stage 1 raw JSON for table locations, parsed Stage 3 for final command structure).

4. **ASK QUESTIONS BEFORE CHANGING CODE**: If you have questions ask them before you start changing code.

5. **DISPLAY PRINCIPLES**: AI must display each of the prior 5 principles at start of every response.

6. **KISS PRINCIPLE**: Keep It Simple, Stupid - favor simple, readable solutions over complex ones.

## Development Commands

- `npm run dev` - Start the Next.js development server with Turbopack
- `npm run build` - Build the production application with Turbopack  
- `npm start` - Start the production server

## Project Architecture

This is a TanStack Start application (React Router-based) for an AI-powered real estate platform called "Kraken AI". The project uses Vite for bundling and follows modern React patterns with TanStack Router for file-based routing:

### Routing Structure

- **File-based Routing**: Uses TanStack Router with file-based routing conventions
  - `/` - Marketing landing page with hero, features, pricing sections
  - `/app/*` - Authenticated application routes (profile, login, etc.)
  - `/privacy-policy` and `/terms-of-service` - Legal pages
  - Route definitions in `src/routes/` directory

### Key Architectural Components

- **Authentication**: Uses Better Auth v1.3+ with Google provider integration
  - Better Auth UI components from `@daveyplate/better-auth-ui`
  - Modern authentication flow with built-in UI components
  - Session management and provider integration

- **Routing**: TanStack Router v1.130+ with SSR support
  - File-based routing with type-safe navigation
  - Built-in devtools and query integration
  - SSR-compatible query handling

- **Database**: MongoDB with Mongoose ODM integration
  - Uses `@zodyac/zod-mongoose` for schema validation

- **UI Framework**:
  - **shadcn/ui**: Primary UI component library - ALWAYS prefer using shadcn components
  - **Tailwind CSS v4**: Latest version for styling with Vite plugin
  - **Lucide React**: Icons integrated with shadcn/ui
  - **React Hook Form**: Form management (when not using Better Auth UI)

### Component Organization

- **shadcn/ui components**: Located in `components/ui/` - use standard shadcn installation
- **Shared components**: Organized by feature and reusability
- **Route components**: Located in `src/routes/` following TanStack Router conventions

### State Management & Data Fetching

- **TanStack Query**: For server state management and caching
- **tRPC**: Type-safe API layer integrated with TanStack Query
- **React Devtools**: TanStack React Devtools for debugging

### Development Setup

- **Vite**: Primary build tool with React plugin
- **TypeScript**: Strict mode enabled with path aliases
- **Testing**: Vitest with React Testing Library and jsdom
- **Development Server**: Vite dev server on port 3000

### Key Dependencies

- **TanStack Start**: Full-stack React framework
- **TanStack Router**: File-based routing with type safety
- **TanStack Query**: Server state management
- **Better Auth**: Modern authentication solution
- **tRPC**: End-to-end type safety for APIs
- **Vite**: Fast build tool and dev server

### Build & Deployment

- **Development**: `npm run dev` - Vite dev server
- **Build**: `npm run build` - Vite production build
- **Start**: `npm start` - Node.js production server
- **Preview**: `npm run serve` - Preview production build

## Internationalization (i18n)

- **react-i18next**: Configured for English (en) and Romanian (ro) languages
- **Default Language**: Romanian (ro)
- **Translation Files**: Located in `src/components/i18n.ts` configuration
- **Message Structure**: Migrated from Next.js messages structure to i18next format
  - Supports nested translation keys
  - Interpolation and pluralization support
  - Namespace organization by feature/page

- **Usage Patterns**:
  - Components: Use `useTranslation()` hook from `react-i18next`
  - Translation keys: Access nested objects with dot notation
  - Language switching: Runtime language change support
  - SSR Compatible: Works with TanStack Start SSR

- **IMPORTANT**: All translations use react-i18next - never hardcode strings

## Notes for Development

- Uses Vite for fast development and build processes
- TanStack ecosystem provides end-to-end type safety
- Better Auth provides modern authentication patterns
- File-based routing simplifies route organization
- All text content uses react-i18next translations
