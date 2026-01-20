# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Now What Alchemizer** is an immersive scrollytelling React application built with TypeScript, Vite, and Framer Motion. The app guides users through a contemplative journey with four distinct stages: Hero, Journey, Audio meditation, and Descent. It features scroll-locking mechanics, staged content unlocking, and an interactive audio experience.

## Development Commands

- **Install dependencies**: `npm install`
- **Run development server**: `npm run dev` (serves on http://localhost:3000)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## Environment Setup

The app requires a Gemini API key for AI functionality:
1. Set `GEMINI_API_KEY` in `.env.local`
2. The key is exposed via Vite's `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

## Architecture

### Stage-Based Flow System

The app uses a gated stage progression system (`AppStage` enum in `types.ts`):
1. **HERO** → User sees rotating statements, must interact to unlock
2. **JOURNEY** → Displays journey stops with an animated Enso circle
3. **AUDIO** → 3-minute contemplative audio experience with rotating questions
4. **DESCENT** → Final section with paper-white background (contrast to dark sections)

**Critical State Management**:
- `stage`: Current visible stage (based on scroll position)
- `unlockedStages`: Set of stages the user has access to
- Stages unlock sequentially via `handleStageUnlock()` in `App.tsx`
- When Journey unlocks, Audio also unlocks automatically to allow scrolling

### Scroll Locking Logic (`App.tsx:81-118`)

The app uses precise scroll locking to gate progression:
- **Hero Lock**: Prevents scrolling until user clicks to unlock Journey
- **Audio Lock**: Triggers when Audio section reaches viewport top (`rect.top <= 10`), snaps to exact position
- **Dev Mode Toggle**: `IS_DEV_MODE` constant in `App.tsx:11` bypasses all locks for testing

**Important**: The scroll lock removes the `scroll-locked` class before programmatic scrolling to enable smooth transitions.

### Component Structure

- **Hero** (`components/Hero.tsx`): Rotating statements from `HERO_STATEMENTS` constant
- **JourneySection** (`components/JourneySection.tsx`): Four journey stops from `JOURNEY_STOPS` constant
- **EnsoCircle** (`components/EnsoCircle.tsx`): Animated Zen circle visualization
- **AudioAlchemizer** (`components/AudioAlchemizer.tsx`): Multi-phase audio experience
  - Phases: `IDLE` → `DROP_IN` (30s) → `QUESTIONS` (23s per question) → `FINISHED`
  - Audio file: `/public/audio/ambient.mp3`
  - Questions rotate from `QUESTION_ROTATOR` constant
- **Descent** (`components/Descent.tsx`): Final stage with light background

### Color Scheme Transitions

Background colors transition via Framer Motion (`App.tsx:23-35`):
- Hero/Journey/Audio: `#050b1a` (deep navy)
- Descent: `#fdfcf8` (paper off-white)

### Path Aliasing

TypeScript and Vite configured with `@/*` alias pointing to root directory:
- `tsconfig.json`: `"@/*": ["./*"]`
- `vite.config.ts`: `alias: { '@': path.resolve(__dirname, '.') }`

Use relative paths starting with `./` or `/` in imports (never `../` per global CLAUDE.md rules).

## Key Constants

All copy content lives in `constants.ts`:
- `HERO_STATEMENTS`: 21 statements for Hero stage rotation
- `JOURNEY_STOPS`: 4 journey descriptions with positions
- `QUESTION_ROTATOR`: 6 contemplative questions for Audio stage

## Styling

- **Tailwind CSS**: Loaded via CDN in `index.html`
- **Fonts**:
  - Serif: 'Cormorant Garamond' (`.font-serif`)
  - Sans: 'Inter' (`.font-sans`)
- **Custom Classes**: `.scroll-locked` in `index.html` prevents all scrolling

## Testing Development Flow

To test the full experience without manual progression:
1. Set `IS_DEV_MODE = true` in `App.tsx:11`
2. All stages unlock immediately on load
3. Set back to `false` for production/intended gated experience
