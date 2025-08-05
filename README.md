# MamaFlow 🍼

A comprehensive pumping log tracker for breastfeeding mothers. Track volume, duration, and schedule reminders to maintain your pumping routine.

## Features

✨ **Core Features:**
- 📊 Track pumping sessions with volume and duration
- 📱 Visual trends with weekly volume charts
- ⏰ Smart reminders with day/night scheduling
- 📥 Import/Export data via CSV
- 🌙 Automatic dark/light mode support
- ♿ Full accessibility support

## Screenshots

*Add screenshots here when ready for store listing*

## Privacy

MamaFlow respects your privacy:
- All data is stored locally on your device
- No data is sent to external servers
- No user tracking or analytics
- View our [Privacy Policy](https://www.privacypolicies.com/live/72f69876-661a-418e-be05-37d7df86dcf0)

## Development

This is an [Expo](https://expo.dev) project built with React Native.

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/AndreyGalchevski/mama-flow-app.git
   cd mama-flow-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

### Building for Production

#### Android (Play Store)
```bash
npm run build:android:production
```

#### iOS (App Store)
```bash
npm run build:ios:production
```

### Project Structure

```
app/                    # App screens and navigation
├── (tabs)/            # Tab navigation screens
├── add-log-modal.tsx  # Add pump log modal
├── edit-log/          # Edit pump log screens
└── _layout.tsx        # Root layout

lib/                   # Shared utilities and components
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization
├── icons/            # Custom SVG icons
└── types.ts          # TypeScript type definitions

assets/               # Static assets (images, fonts)
```

### Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Native Paper** - UI components
- **Zustand** - State management
- **MMKV** - Fast local storage
- **React Native Gifted Charts** - Data visualization
- **expo-notifications** - Push notifications
- **date-fns** - Date utilities

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### License

This project is licensed under the MIT License.

### Support

For issues or questions:
- Open an issue on GitHub
- Email: support@mamaflow.app (replace with actual email)

### Changelog

#### v1.0.0
- Initial release
- Core pumping log functionality
- Reminder system
- CSV import/export
- Accessibility support
