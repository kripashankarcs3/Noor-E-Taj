# BrideVerse AI — Project Report

---

## 1. Project Overview

**BrideVerse AI** is an intelligent bridal beauty marketplace for brides in Delhi NCR. It is an all-in-one AI-powered wedding planning co-pilot that helps brides discover salons, visualize wedding looks, manage budgets, and coordinate with vendors — all within a single dashboard.

**Project Type:** Frontend Single Page Application (SPA)  
**Status:** Functional Prototype / MVP  
**Submitted:** June 2026

---

## 2. Problem Statement

Indian weddings present 5 major problems for brides:

| # | Problem | Explanation |
|---|---------|-------------|
| 1 | **Discovery Gap** | There is no centralized platform to find bridal makeup artists, mehendi artists, hairstylists, and salon services in Delhi NCR. Each vendor operates on a different app or website. |
| 2 | **Visualisation Barrier** | Brides cannot envision how different makeup looks, hairstyles, and outfits will appear on them without actual trials. |
| 3 | **Coordination Overload** | Managing bookings, trials, payments, and vendor communication across multiple apps (WhatsApp, Instagram, Phone) is exhausting. |
| 4 | **Budget Blindness** | Wedding costs spiral out of control because there is no tool to track, compare, and optimize vendor pricing. |
| 5 | **Moodboard Mess** | Inspiration is scattered across Pinterest, Instagram, and WhatsApp — there is no unified vision board. |

**Solution:** BrideVerse AI solves all 5 problems on a single platform.

---

## 3. Target Audience

- **Primary:** Delhi NCR brides-to-be (age 22–35)
- **Secondary:** Wedding planners and bridal coordinators
- **Future Scope:** Makeup artists and salon owners (vendor side)

---

## 4. Tech Stack

### 4.1 Frontend Technologies

| Technology | Version | What Is It? | Why Was It Used? |
|---|---|---|---|
| **React** | 19.2.6 | UI framework | Industry standard with component-based architecture for reusability. Each feature is a standalone component that can be reused. |
| **Vite** | 8.0.12 | Build tool & dev server | Provides 10x faster HMR (Hot Module Replacement) than Webpack. Browser updates instantly on code changes. Native ES module support. |
| **JavaScript (ES6+)** | — | Programming language | Faster prototyping than TypeScript. Can migrate to TypeScript later. |
| **Framer Motion** | 12.40.0 | Animation library | Best for declarative animations. AnimatePresence provides exit animations that are difficult with raw CSS. |
| **Lucide React** | 1.21.0 | Icon library | Lightweight, tree-shakeable (only used icons are bundled), consistent stroke-based design. |
| **CSS3 (Custom Properties)** | — | Styling | Custom CSS over Tailwind because the app has its own brand identity (maroon + gold). CSS variables make theme management easy. |
| **localStorage API** | — | Data persistence | No backend, so client-side data storage was needed. localStorage is simple, zero cost, and persists after refresh. |
| **OpenRouter API** | — | AI integration | Used for AI Chat feature. Can call AI models directly from the frontend without a backend. API key stored in .env. |

### 4.2 Backend (Planned)

| Technology | What Is It? | Why Was It Chosen? |
|---|---|---|
| **Node.js + Express.js** | REST API server | Frontend is already JavaScript, so one language for both backend and frontend. Express is the most mature Node.js framework. |
| **MongoDB + Mongoose** | Database | Document-based with flexible schema. Perfect for dynamic data like moodboards, messages, and bookings. |
| **JWT + Bcryptjs** | Authentication | Stateless authentication, secure password hashing. Easy to scale. |
| **Socket.io** | Real-time | For real-time bride-to-artist chat. Bi-directional communication. |
| **Multer** | File uploads | For profile photos and moodboard image uploads. |

---

## 5. Architecture

### 5.1 Overall Structure

```
┌─────────────────────────────────────────────────────┐
│                     BROWSER                          │
│  ┌───────────────────────────────────────────────┐  │
│  │           REACT SPA (Vite Build)              │  │
│  │                                               │  │
│  │  App.jsx (Root Orchestrator)                  │  │
│  │  ├── State: activeTab, darkMode, userProfile  │  │
│  │  ├── Persistence: localStorage (noor_* keys)  │  │
│  │  └── Routing: Tab-based (no React Router)     │  │
│  │                                               │  │
│  │  ┌──────────┐ ┌───────────┐ ┌─────────────┐  │  │
│  │  │ Dashboard │ │  Planner  │ │ Artists &   │  │  │
│  │  │ (Default) │ │4-Step Flow│ │ Salons      │  │  │
│  │  └──────────┘ └───────────┘ └─────────────┘  │  │
│  │  ┌──────────┐ ┌───────────┐ ┌─────────────┐  │  │
│  │  │ AI Tools │ │   Wallet  │ │  Settings   │  │  │
│  │  │ 6-in-1   │ │ & Offers  │ │   Page      │  │  │
│  │  └──────────┘ └───────────┘ └─────────────┘  │  │
│  │  ┌──────────┐ ┌───────────┐ ┌─────────────┐  │  │
│  │  │ Booking  │ │ Moodboard │ │  Messages   │  │  │
│  │  │ Details  │ │  Boards   │ │   (Chat)    │  │  │
│  │  └──────────┘ └───────────┘ └─────────────┘  │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │         PERSISTENCE LAYER               │  │  │
│  │  │  localStorage: noor_profile,            │  │  │
│  │  │  noor_trial_bookings, noor_dark_mode... │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│              ↕ (Future: HTTP/HTTPS)                  │
│  ┌───────────────────────────────────────────────┐  │
│  │      NODE.JS + EXPRESS API SERVER             │  │
│  │      (Planned for Production)                 │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 5.2 Architecture Decisions

| Decision | Explanation |
|---|---|
| **No React Router** | The app is tab-based (sidebar navigation). Router is unnecessary. `activeTab` state determines which component is rendered. |
| **No Redux/Context** | Simple useState + useEffect is sufficient at this scale. Custom window events used for cross-component communication. |
| **localStorage for persistence** | No backend, so client-side storage was needed. localStorage persists data after refresh/session close. |
| **Single `noor_profile` key** | Both SettingsPage and UserProfile use the same localStorage key, so changes auto-sync. |

### 5.3 Data Flow

```
User Input → React State → localStorage
    ↓                           ↓
Component Rerenders        Page Refresh
    ↓                           ↓
UI Updated              useState reads localStorage
```

**Example:** Changing name in Settings → `setFullName()` → localStorage set → UserProfile reads the same key → name updates everywhere.

---

## 6. Features Explanation

### 6.1 Dashboard (App.jsx)
**What it is:** Main screen shown after login.  
**What it does:**
- Shows upcoming bookings (trial data from localStorage)
- Today's inspiration section (moodboard preview)
- Quick actions: Plan Wedding, Browse Artists, AI Tools, Wallet
- Search bar — filters bookings, artists, and moodboards
- Notifications panel — Bell icon, categories: Bookings/Offers/Reminders
- Reviews tab — Write review (localStorage save), delete, Given/Received filter
- Wedding countdown + checklist progress

### 6.2 Bridal Planner (BridalPlanner.jsx)
**What it is:** Step-by-step wedding planning wizard.  
**Why it was built:** To provide brides with a structured flow that guides their wedding planning.  
**Flow:**
- Step 1: Wedding type select (Traditional, Destination, Modern, Court, Pre-Wedding)
- Step 2: Month, venue, style, budget, color palette selection
- Step 3: AI-style matching → generates matched artist list
- Step 4: Browse, filter, compare artists, cost estimate
- Step 5: Artist detail → services, packages → Book Now

### 6.3 Artists & Salons (ArtistsSalons.jsx)
**What it is:** Bridal vendor marketplace.  
**Features:**
- Artist cards with rating, location, match %, price
- Category tabs (All, Makeup, Hair, Mehndi, Outfit)
- Sort by Match %, Price, Rating, Experience
- AI Search — natural language query for artist search
- Portfolio carousel (images + videos)
- Availability checker with time slots
- Book Now flow (date → services → add-ons → confirm)
- Share profile + More options dropdown

### 6.4 Booking Details (BookingDetails.jsx)
**What it is:** Post-booking management screen.  
**Features:**
- Booking summary (artist, service, date, price, status)
- Reschedule — Change date/time modal + reason selector
- Cancel booking → degraded UI with red banner
- Add-ons — post-booking service additions
- Invoice download as .txt file
- Status: Confirmed / Pending / Cancelled

### 6.5 AI Tools (AiToolsContainer.jsx)
**What it is:** 6 AI-powered bridal tools in one screen.  
**Tools:**
1. **Digital Twin** — AI bridal avatar with 6 makeup looks (Royal, Minimal, Glam, Boho, Classic, Modern)
2. **Makeup Lookbook** — Browse/customize makeup styles with lip, eye, hair, jewellery breakdown
3. **AI Chat** — Ask wedding questions via OpenRouter API
4. **Face Analyzer** — Face shape analysis + personalized recommendations
5. **Budget Optimizer** — Input budget → vendor suggestions
6. **Spot Eraser** — Photo upload/edit with zoom

### 6.6 Moodboard (MyMoodboard.jsx)
**What it is:** Visual inspiration board manager.  
**Features:**
- Grid view with images, titles, likes, pin counts
- Create Board — name, description, category tags, cover image
- Edit Board — update details, change cover
- Like/Unlike — localStorage persist
- Sort: Newest / Oldest / Most Liked
- More Menu: Edit, Duplicate, Share (copy link), Delete
- AI Generate button (toast placeholder)

### 6.7 Messages (Messages.jsx)
**What it is:** Chat simulation.  
**Features:**
- Conversation list with avatars, last message, unread count
- Chat bubbles, timestamps, file attachments
- Emoji picker for expressive messaging
- Send Inspiration — upload/share images
- Audio/Video call buttons (toast placeholders)
- Search conversations filter

### 6.8 Wallet & Offers (WalletOffers.jsx)
**What it is:** Financial dashboard.  
**Features:**
- Balance display + Add Money form
- Transaction history with dates
- Exclusive offers with coupon codes (copy to clipboard)
- Payment methods (cards/UPI) + Add New form
- Chat with Support navigation
- View All Offers toggle

### 6.9 Settings (SettingsPage.jsx)
**What it is:** Account management.  
**Tabs:**
- **Account** — Name, phone (+91), email, DOB, location, language
- **Notifications** — Email/Push/SMS/WhatsApp toggles
- **Privacy** — Profile visibility, activity status, data sharing
- **Payments** — Saved methods, add/edit, security
- **Preferences** — Wedding Prefs, Address Book, Sound, Language, Currency
- **Security** — Change Password, 2FA, Login Activity, Delete Account
- Theme toggle (Dark/Light), Save Changes, Logout

### 6.10 User Profile (UserProfile.jsx)
**What it is:** Personal profile page.  
**Features:**
- Profile photo upload/change (localStorage save)
- Inline name editing
- Membership badge (Standard/Elite)
- Tabs: Wedding, Beauty, Address, Payment
- Quick Actions: Style Quiz, View Moodboard, Journey Timeline
- Refer & Earn, Chat with Support

### 6.11 Package Details (PackageDetails.jsx)
**What it is:** Service package booking flow.  
**Steps:**
1. Package details, date/time, quantity selection
2. Review order, promo code application
3. Payment processing → Booking Confirmed

### 6.12 Login Page (LoginPage.jsx)
**What it is:** Authentication UI.  
**Features:** Email/Password login, Google login placeholder, Remember me, Register link

---

## 7. Data Persistence

Since there is no backend, all data is stored in **localStorage**. Each key uses the unique prefix `noor_`.

| Key | What Does It Store? | Where Is It Used? |
|---|---|---|
| `noor_logged_in` | Login session flag (true/false) | App.jsx |
| `noor_dark_mode` | Dark/Light theme preference | App.jsx, SettingsPage |
| `noor_profile` | User profile (name, phone, membership) | App.jsx, SettingsPage, UserProfile |
| `noor_profile_photo` | Profile photo as data URL | UserProfile |
| `noor_notifications` | Notifications array | App.jsx |
| `noor_privacy` | Privacy settings object | SettingsPage |
| `noor_trial_bookings` | Bookings array | App.jsx, BookingDetails |
| `noor_wishlist` | Saved/favorite items array | MyMoodboard |
| `noor_moodboard_liked` | Liked board IDs array | MyMoodboard |
| `noor_saved_plan` | Bridal planner state | BridalPlanner |
| `noor_wallet_balance` | Wallet number | WalletOffers |
| `noor_reviews` | User reviews array | App.jsx |
| `noor_moodboard_photos` | Moodboard images array | MyMoodboard |

**Data Flow Pattern:**
```
Component State ←→ localStorage
     ↓
UI Renders
```

---

## 8. Design System

### Colors
- **Primary:** Maroon/Dark Red (`#4A0404`, `#6B1020`) — represents bridal elegance
- **Accent:** Gold (`#C49F57`) — conveys luxury and celebration
- **Background:** Dark mode (#1a1a1a), Light mode (warm cream)
- **Buttons:** Gold-on-maroon gradients

### Typography
- **Headings:** Playfair Display (serif) — for wedding elegance
- **Body:** Plus Jakarta Sans / Inter (sans-serif) — modern readability

### Visual Elements
- Dark mode first design (premium feel)
- Glassmorphism in modals
- Framer Motion animations (fade-in, slide-up, scale)
- 25+ bridal photography assets

---

## 9. File Structure

```
BrideVerse AI/
│
├── index.html                  # Entry point (fonts, meta tags)
├── vite.config.js              # Vite build configuration
├── package.json                # Dependencies list
├── eslint.config.js            # Code quality rules
├── hackread.md                 # This file — project documentation
│
├── public/                     # Static images (25 files)
│   ├── bridal_lehenga.png
│   ├── digital_twin_portrait.png
│   ├── luxury_salon.png
│   ├── priya_profile.png
│   └── ...
│
└── src/                        # Source code
    ├── main.jsx                # React DOM render
    ├── App.jsx                 # Root component (dashboard + routing)
    ├── App.css                 # App styles
    ├── index.css               # Global styles, variables, dark mode
    ├── animations.js           # Framer Motion configs
    │
    ├── services/
    │   └── aiService.js        # OpenRouter API calls
    │
    ├── assets/
    │   ├── illustrations.jsx   # SVG components
    │   └── images...
    │
    └── components/             # 16 React components
        ├── LoginPage.jsx
        ├── BridalPlanner.jsx
        ├── BridalDetailsStep.jsx
        ├── VenueDetailsStep.jsx
        ├── ArtistsSalons.jsx
        ├── SalonMarketplace.jsx
        ├── BookingDetails.jsx
        ├── BookingConfirmed.jsx
        ├── PackageDetails.jsx
        ├── PaymentStep.jsx
        ├── MyMoodboard.jsx
        ├── AiToolsContainer.jsx
        ├── Messages.jsx
        ├── WalletOffers.jsx
        ├── SettingsPage.jsx
        └── UserProfile.jsx
```

---

## 10. How to Run

```bash
# Step 1: Install dependencies
npm install

# Step 2: Start development server
npm run dev
# → Browser automatically opens at http://localhost:5173

# Step 3: Production build
npm run build

# Step 4: Preview the build
npm run preview
```

---

## 11. Testing

No formal testing framework is in place yet (Jest/Cypress). Testing has been done manually:
- Clicked every button to verify functionality
- Ran build command to check for errors (`npm run build` → success)
- Verified localStorage persistence (checked data after refresh)
- Checked responsive design (different screen sizes)

---

## 12. Challenges Faced

| Challenge | Solution |
|---|---|
| **No backend** — all data had to be stored client-side | Used localStorage with custom events (`profile_update`) for cross-component sync |
| **Non-functional buttons** — 40+ buttons only showed toasts | Gave each button actual functionality — modals, localStorage save, clipboard copy, navigation |
| **Profile changes lost on refresh** | Each form field's `useState` initializer reads data from localStorage |
| **125vh typo** — Messages page scroll was broken | Fixed `125vh` → `100vh` |
| **Review delete used DOM manipulation** | Rewrote it as actual React state-based deletion |

---

## 13. Future Scope

| Phase | Features | Technology |
|---|---|---|
| **Phase 1: Backend** | REST API, JWT auth, CRUD operations | Node.js + Express + MongoDB |
| **Phase 2: Real-time** | Live chat, booking updates, collaborative moodboard | Socket.io |
| **Phase 3: Payments** | Wallet top-up, invoice PDF, refunds | Razorpay/Stripe |
| **Phase 4: AI** | Real digital twin, smart budget optimization | Custom ML model |
| **Phase 5: Production** | TypeScript, React Router, PWA, code splitting | Various |

---

## 14. Conclusion

BrideVerse AI is a comprehensive bridal beauty marketplace that demonstrates modern frontend engineering principles. With 15+ interactive components, AI integration, dark mode, and complete data persistence, it is a functional prototype. The architecture is deliberately modular and clean so that it works without a backend, and migration will be easy once a backend is ready.

---

*Built with React 19, Vite 8, Framer Motion — June 2026*
