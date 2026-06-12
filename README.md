# Mecarvi Rush — Customer Mobile App

A full-featured **React Native** marketplace application for print, embroidery, signage, and courier services. Customers can browse services, book orders, bid in a marketplace, chat in real time, track deliveries, and pay securely — all from one app.

---

## Features

### Core
- **Multi-role auth** — Customer and Service Provider flows with Firebase Authentication
- **Onboarding & KYC** — ID card, photo, and business card upload for service providers
- **Deep linking** — Password reset and payment callbacks via `mecarvirush://` scheme

### Marketplace & Shopping
- **Product catalog** — Image sliders, attribute/size/color selectors, quantity picker, custom order notes
- **Marketplace bidding** — Customers post requirements; providers submit bids; customer accepts
- **Cart & Checkout** — Line items, delivery scheduling, address management, coupon/points redemption
- **Multiple payment methods** — Stripe card payments, wallet balance, loyalty points

### Orders & Logistics
- **Order lifecycle management** — Pending → Processing → Dispatched → Delivered states
- **Delivery scheduling** — Date/time picker for service bookings
- **Refund & dispute flow** — In-app dispute creation with dedicated chat thread

### Communication
- **Real-time chat** — Firebase Firestore-backed customer ↔ provider messaging
- **Support tickets** — Create, track, and respond to support tickets in-app
- **Push notifications** — FCM via `@notifee/react-native` with token management

### User Experience
- **Dark / Light theme** — Follows system preference, manual toggle available
- **Loyalty points** — Earn on purchases, redeem at checkout
- **Subscription plans** — Tiered provider subscriptions with Stripe billing
- **Reviews & ratings** — Post-order feedback with star ratings
- **Geolocation** — Location-aware delivery address creation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.77 (New Architecture) |
| Language | TypeScript 5 |
| Navigation | React Navigation 7 — Native Stack, Bottom Tabs, Drawer |
| State | Redux Toolkit + Redux Persist (AsyncStorage) |
| Backend / DB | Firebase Firestore |
| Auth | Firebase Authentication |
| Push Notifications | Firebase Cloud Messaging + Notifee |
| Payments | Stripe React Native SDK |
| Forms | Formik + Yup |
| HTTP | Axios |
| UI Primitives | React Native Elements, React Native Vector Icons |
| Media | React Native Fast Image, Image Picker, Document Picker, Video |
| Charts | React Native Pie Chart, Progress |
| Animations | React Native Reanimated, Animatable |
| Geolocation | React Native Geolocation Service |

---

## Project Structure

```
src/
├── assets/
│   ├── images/              # SVG & PNG assets
│   └── styles/              # Per-screen StyleSheet modules (.ts, no JSX)
├── components/
│   ├── common/              # Reusable UI — Button, TextInput, Header, Modal, OrderCard…
│   │   ├── address/         # Address creation component
│   │   └── shopProfile/     # Provider profile sub-components (About, Reviews, Work…)
│   ├── cardPayment/         # Stripe card payment modal
│   ├── navigators/          # Bottom tabs & Drawer navigator setup
│   └── tabIcons/            # Custom tab bar icon components
├── context/
│   └── ThemeContext.tsx     # Dark/Light theme context + system-preference listener
├── hooks/                   # Custom React hooks
├── screens/
│   ├── login/ register/ forget/ verify/ upload/  # Auth & onboarding flow
│   ├── dashboard/           # Home — banners, featured products, services, filters
│   ├── product/ products/   # Product detail & catalog
│   ├── cart/ checkout/      # Cart management, payment, address, scheduling
│   ├── orders/              # Order list, detail, modals (cancel, refund, review)
│   ├── marketPlace/         # Bid listing & provider cards
│   ├── chat/ message/       # Chat list & real-time message threads (Firestore)
│   ├── disputes/            # Dispute creation & chat
│   ├── ticketSupport/       # Support ticket creation, list, chat
│   ├── subscription/        # Plan cards & Stripe subscription logic
│   ├── points/              # Rewards summary & redemption
│   └── shop/                # Service provider shop profile
├── services/
│   ├── api.ts               # Axios wrapper with auth header injection
│   ├── firebase.ts          # Firebase app, Firestore, Auth, Messaging init
│   └── notifications.ts     # FCM token management & notification routing
├── store/
│   ├── authSlice.ts         # Redux slice — auth, cart, delivery, bidding, wallet state
│   └── index.ts             # Configured Redux store + redux-persist setup
├── types/
│   ├── navigation.ts        # RootStackParamList + shared domain interfaces
│   └── mockData.ts          # Static sample data (dev/demo use)
└── utils/
    ├── dateTime.ts          # Formatted date/time helpers
    ├── location.ts          # US city/country lookup utility
    ├── timeUtils.ts         # 12h ↔ 24h time format converter
    └── validation.ts        # Yup validation schemas (register, customer)
```

```
App.tsx       # Root navigator, Stripe provider, deep link handler
index.js      # React Native entry point
.env          # Local secrets — never committed (see .env.example)
.env.example  # Template for required environment variables
env.d.ts      # TypeScript declarations for react-native-config
```

---

## Getting Started

### Prerequisites

- Node >= 18
- Ruby (for CocoaPods on iOS)
- Xcode 15+ (iOS) / Android Studio (Android)
- A Firebase project with **Authentication**, **Firestore**, and **Cloud Messaging** enabled
- A Stripe account (test or live)

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/Mecarvi_Rush.git
cd Mecarvi_Rush
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your own keys:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) below for details.

### 3. iOS setup

```bash
bundle install          # install CocoaPods gem (first time only)
bundle exec pod install # install native iOS dependencies
npm run ios
```

### 4. Android setup

```bash
npm run android
```

---

## Environment Variables

Create a `.env` file at the project root (never commit it — it is in `.gitignore`):

```env
# Firebase
FIREBASE_API_KEY_IOS=your_ios_api_key
FIREBASE_API_KEY_ANDROID=your_android_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID_IOS=your_ios_app_id
FIREBASE_APP_ID_ANDROID=your_android_app_id

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> **Firebase:** Download the native config files from the Firebase console and place them at:
> - `android/app/google-services.json`
> - `ios/Mecarvi/GoogleService-Info.plist`
>
> The native SDKs read directly from these files; the JS-side `firebaseConfig` object is used only for web/Firestore initialisation.

---

## Architecture Notes

### State Management
A single Redux slice (`src/store/authSlice.ts`) manages all global state — user session, cart, delivery scheduling, bid details, and wallet/points. The store is configured in `src/store/index.ts`. Redux Persist hydrates the `cart` and `sourceType` fields from AsyncStorage on launch so cart contents survive restarts.

### Navigation
Three nested navigators mirror the app's UX hierarchy:
1. **Root Native Stack** (`App.tsx`) — auth screens + all modal-style screens
2. **Drawer** — wraps the main authenticated section
3. **Bottom Tabs** — Dashboard, Orders, Chats, Cart (Cart hidden for Service Provider role)

### Real-time Chat
All chat (customer ↔ provider, dispute threads, support tickets) is backed by **Firebase Firestore** with `onSnapshot` listeners for live updates. FCM tokens are managed centrally in `src/services/notifications.ts` and stored per-user in Firestore.

### Theme System
A `ThemeContext` wraps the entire app. It reads `Appearance.getColorScheme()` on mount, listens for system changes, and exposes a `toggleTheme()` function for the in-app toggle. Screen-level styles consume the context rather than hard-coding colours.

### Payments
Stripe is initialised at the app root via `<StripeProvider>`. The checkout screen supports card payments (via `CardPaymentModal`), wallet balance, and loyalty points — each as a discrete selectable option.

---

## Scripts

```bash
npm start         # Start Metro bundler
npm run android   # Build and run on Android
npm run ios       # Build and run on iOS
npm run lint      # ESLint
npm test          # Jest
```

---

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feature/my-feature`
2. Commit with a descriptive message
3. Open a pull request — describe what changed and why
