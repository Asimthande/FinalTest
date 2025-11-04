# HotelBookingApp

This repository contains the HotelBooking mobile app (React Native + Expo).

This README was generated automatically and documents how to run the project locally and the recent change where app icons/images were switched to use the assets in `assets/Materials`.

## Project layout

- `HotelBookingApp/` — main Expo React Native app
  - `App.js`, `index.js`, `package.json`, etc.
  - `assets/Materials/` — design assets and icons used across the app
  - `screens/`, `navigation/`, `components/` — UI and navigation code

## Recent changes

I updated the app to use the images included in `assets/Materials` for a consistent visual look. The main changes are:

- `screens/OnboardingScreen.js` — now uses `assets/Materials/01-Onboarding Page/Onboarding 1.png`, `Onboarding 2.png`, `Onboarding 3.png`.
- `screens/ExploreScreen.js` — sample hotel thumbnails now use images from `assets/Materials/06-Explore Page`.
- `navigation/MainTabs.js` — bottom tab icons wired to local images from `assets/Materials/06-Explore Page` with a vector fallback.
- `screens/SignInScreen.js` — replaced the header/business icon with the project logo `assets/Materials/LOGO/120x120.png`.

If you need other icons replaced by images from the Materials folder (for example, alert icons in `components/MessageAlert.js` or other Ionicons across screens), open an issue or request and I'll continue.

## How to run (local)

Requirements:

- Node.js (LTS recommended)
- Expo CLI (optional, you can also use `npx expo`)

Quick start from repository root:

```bash
cd HotelBookingApp
npm install
npm run start
```

Then open the Expo QR code in Expo Go (Android) or in the iOS Simulator / web as the bundler suggests.

## Notes about icons

- The tab icons are using PNG assets with a `tintColor` applied in code. Tinting works best with single-color/transparent images. If your PNGs are multi-colored, consider providing a monochrome variant for correct tinting, or keep vector icons for tabs.
- For better mobile performance, consider optimizing large PNGs (resize and compress) under `assets/Materials`.

## Contributing / Next steps

- If you'd like a consistent switch of all vector icons to bitmap images, I can continue updating other screens.
- I can also add a small script to optimize the assets folder (resize/compress) if desired.

---

If anything should be adjusted in this README (different commands, more details, or placement inside `HotelBookingApp/`), tell me and I'll update it.
