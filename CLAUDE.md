# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in browser
npm run lint       # Run ESLint (expo lint)
```

No test framework is configured — there are no automated tests to run.

## Architecture Overview

**RLKids** is an educational React Native/Expo app for two distinct user roles: **Guardian** (parent/teacher) and **Kid** (learner). The role determines which navigation tabs and features are shown.

### Navigation (Expo Router file-based)

- `app/index.tsx` — Entry point, redirects to onboarding or tabs based on auth state
- `app/auth/` — Login, SignUp, ForgotPassword, ProfileSelection
- `app/(tabs)/` — Main tabbed interface; tabs differ by role (`user.role === 'guardian'` vs `'kid'`)
- `app/guardian/` and `app/kid/` — Role-specific deep screens

### State Management

Three layers, each with a distinct purpose:
1. **Redux Toolkit** (`/redux/store.ts`) — Auth session + sidebar UI state only
2. **TanStack React Query** — Server state, caching for API data
3. **React Context** — `SoundContext` (audio playback), `ReadContext` (text-to-speech settings)

Provider nesting order in `app/_layout.tsx`: `QueryClientProvider → SoundProvider → ReadSettingsProvider → Redux Provider → GestureHandlerRootView`

### API Layer

- Axios instance at `lib/axios.ts` — auto-injects Bearer token from AsyncStorage on every request
- Base URL: `https://rl4kids-be.onrender.com/api/v1`
- API calls live in `actions/[feature]/index.ts`, returning raw `res?.data`
- Custom hooks in `hooks/` wrap API calls and expose loading/error states

### Styling

- **Nativewind** (Tailwind CSS for React Native) is the primary styling method
- Design tokens (colors, fonts) in `constants/theme.ts`
- `utils/index.ts` contains `scaleWidth()` for responsive sizing
- Custom fonts: WorkSans, Lexend (loaded via Expo Font)

### Key Utilities

- `lib/storage.ts` — AsyncStorage wrapper with JSON serialization (`getData<T>`, `storeData<T>`)
- `utils/index.ts` — Date formatting (ordinal suffixes, relative time), `ensureHttps()`, device info
- `hooks/redux.ts` — Typed `useAppDispatch` / `useAppSelector` wrappers

### Notable Features

- **PDF export**: `expo-print` + `expo-sharing` — captures chart view refs and shares via OS share sheet
- **Push notifications**: Registered on startup in root layout, token saved to backend
- **Audio**: `SoundContext` preloads sounds (`success`, `correct`, `wrong`, `cheers`, `trash-drop`) using `expo-audio`
- **Text-to-speech**: `react-native-tts` via `ReadContext`
- **Charts**: `react-native-gifted-charts` for progress visualization

### Forms

React Hook Form + Zod schema validation throughout. Zod schemas are defined inline or in `/types/`.
