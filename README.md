# MamaFlow

MamaFlow is a simple, focused pumping log for breastfeeding parents. Log volume and duration, see weekly trends, and set gentle reminders that fit your routine.

## Features

- Log pumping sessions with volume and duration
- Weekly volume chart to spot trends
- Day/night reminders you control (local notifications)
- CSV import and export
- Localization: English, Hebrew, Russian, Arabic; RTL and accessibility support

## Data and privacy

- Your pumping logs are stored on-device using fast local storage (MMKV).
- The app does not include ads or behavioral analytics.
- Privacy policy: https://www.privacypolicies.com/live/72f69876-661a-418e-be05-37d7df86dcf0

## Getting started

### Prerequisites

- Node.js 18+
- npm
- Xcode (iOS) and/or Android Studio (Android)

### Install and run

Common scripts:

- `npm start` — start Expo
- `npm run ios` — run on iOS simulator/device
- `npm run android` — run on Android emulator/device

## Build and release

Builds are managed with EAS. You’ll need an Expo account and to configure credentials.

- Android (production): `npm run build:android:production`
- iOS (production): `npm run build:ios:production`

Preview and development profiles are available in `eas.json`.

## Project structure

```
app/                    # Screens and navigation (Expo Router)
├── (tabs)/             # Tab screens
├── add-log-modal.tsx   # Add pump log
├── edit-log/           # Edit pump log
└── _layout.tsx         # Root layout

lib/                    # Shared utilities and components
├── components/         # Reusable UI
├── hooks/              # Custom hooks
├── i18n/               # Translations and RTL support
├── icons/              # SVG icons
└── types.ts            # Types

assets/                 # Images and fonts
```

## Tech highlights

- Expo + React Native 0.79, React 19
- TypeScript
- Expo Router
- React Native Paper (UI)
- Zustand + MMKV for state and storage
- D3 (minimal) for charts
- expo-notifications for local reminders
- date-fns for dates

## Development

- `npm run lint` — format and lint with Biome
- `npm run lint:check` — check only
- `npm run type-check` — TypeScript types
- `npm run doctor` — Expo diagnostics

## License

MIT — see `LICENSE` for details.

## Support

Questions or issues? Open a GitHub issue or email: andreygalchevski@gmail.com