# BrideVerse AI — Project Report

---

## 1. Project Overview

**BrideVerse AI** Delhi NCR ki brides ke liye ek intelligent bridal beauty marketplace hai. Yeh ek all-in-one AI-powered wedding planning co-pilot hai jo brides ko salons discover karne, wedding looks visualize karne, budgets manage karne, aur vendors ke saath coordinate karne mein help karta hai — sab ek hi dashboard mein.

**Project Type:** Frontend Single Page Application (SPA)  
**Status:** Functional Prototype / MVP  
**Submitted:** June 2026

---

## 2. Problem Statement (Kyu Banaya?)

Indian weddings mein brides ko 5 major problems face karni padti hain:

| # | Problem | Explanation |
|---|---------|-------------|
| 1 | **Discovery Gap** | Delhi NCR mein bridal makeup artists, mehendi artists, hairstylists aur salon services dhoondhne ka koi centralized platform nahi hai. Har vendor alag app/website pe hai. |
| 2 | **Visualisation Barrier** | Brides soch nahi sakti ki unpe different makeup looks, hairstyles, aur outfits kaise dikhenge bina actual trial kiye. |
| 3 | **Coordination Overload** | Bookings, trials, payments, aur vendor communication multiple apps (WhatsApp, Instagram, Phone) pe manage karna exhausting hai. |
| 4 | **Budget Blindness** | Wedding costs spiral ho jati hai kyunki koi tool nahi hai jo vendor pricing track, compare, aur optimise kare. |
| 5 | **Moodboard Mess** | Inspiration Pinterest, Instagram, WhatsApp pe scattered hoti hai — koi unified vision board nahi hai. |

**Solution:** BrideVerse AI inhi 5 problems ko ek hi platform pe solve karta hai.

---

## 3. Target Audience (Kiske Liye Banaya?)

- **Primary:** Delhi NCR ki brides-to-be (age 22–35)
- **Secondary:** Wedding planners aur bridal coordinators
- **Future Scope:** Makeup artists aur salon owners (vendor side)

---

## 4. Tech Stack (Kya Use Kiya Aur Kyun?)

### 4.1 Frontend Technologies

| Technology | Version | Kya Hai? | Kyun Use Kiya? |
|---|---|---|---|
| **React** | 19.2.6 | UI framework | Industry standard hai, component-based architecture allows reusability. Har feature ek alag component hai jo dobara use ho sakta hai. |
| **Vite** | 8.0.12 | Build tool & dev server | Webpack se 10x fast HMR (Hot Module Replacement) deta hai. Code change karte hi browser instantly update hota hai. ES modules natively support karta hai. |
| **JavaScript (ES6+)** | — | Programming language | TypeScript se fast prototyping hoti hai. Baad mein TypeScript migrate kar sakte hain. |
| **Framer Motion** | 12.40.0 | Animation library | Declarative animations ke liye best hai. AnimatePresence exit animations bhi deta hai jo raw CSS mein mushkil hota hai. |
| **Lucide React** | 1.21.0 | Icon library | Lightweight hai, tree-shakeable hai (sirf used icons bundle hoti hain), aur consistent stroke-based design hai. |
| **CSS3 (Custom Properties)** | — | Styling | Tailwind ki jagah custom CSS isliye kyunki app ka apna brand identity hai (maroon + gold). CSS variables se theme manage karna easy hai. |
| **localStorage API** | — | Data persistence | Backend nahi hai to client-side data store karna tha. localStorage simple hai, zero cost hai, aur refresh ke baad bhi data rehta hai. |
| **OpenRouter API** | — | AI integration | AI Chat feature ke liye. Bina backend ke directly frontend se AI model call kar sakte hain. API key .env mein store ki gayi hai. |

### 4.2 Backend (Planned)

| Technology | Kya Hai? | Kyun Chuna? |
|---|---|---|
| **Node.js + Express.js** | REST API server | Frontend already JavaScript hai, to ek hi language backend + frontend. Express sabse mature Node.js framework hai. |
| **MongoDB + Mongoose** | Database | Document-based hai to flexible schema allow karta hai. Moodboards, messages, bookings jaise dynamic data ke liye perfect. |
| **JWT + Bcryptjs** | Authentication | Stateless auth, secure password hashing. Scale karne mein aasan hai. |
| **Socket.io** | Real-time | Bride ⇄ Artist real-time chat ke liye. Bi-directional communication. |
| **Multer** | File uploads | Profile photos, moodboard images upload karne ke liye. |

---

## 5. Architecture (Kaise Bana Hai?)

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
| **No React Router** | App tab-based hai (sidebar navigation). Router ki zaroorat nahi. `activeTab` state hi component render decide karta hai. |
| **No Redux/Context** | Simple useState + useEffect kaafi hai is scale pe. Cross-component communication ke liye custom window events use kiye. |
| **localStorage for persistence** | Backend nahi hai to client-side store chahiye tha. localStorage refresh/session close ke baad bhi data rehta hai. |
| **Single `noor_profile` key** | SettingsPage aur UserProfile dono same localStorage key use karte hain, to changes automatically sync ho jate hain. |

### 5.3 Data Flow

```
User Input → React State → localStorage
    ↓                           ↓
Component Rerenders        Page Refresh
    ↓                           ↓
UI Updated              useState reads localStorage
```

**Example:** Settings page mein name change kiya → `setFullName()` → localStorage set → UserProfile bhi wahi key read karta hai → dono jagah naam update.

---

## 6. Features Explanation (Kya Kya Banaya?)

### 6.1 Dashboard (App.jsx)
**Kya hai:** Login ke baad dikhne wala main screen.  
**Kya karta hai:**
- Upcoming bookings dikhata hai (trial data localStorage se)
- Today's inspiration section (moodboard preview)
- Quick actions: Plan Wedding, Browse Artists, AI Tools, Wallet
- Search bar — bookings, artists, moodboards sab filter karta hai
- Notifications panel — Bell icon, categories: Bookings/Offers/Reminders
- Reviews tab — Write review (localStorage save), delete, Given/Received filter
- Wedding countdown + checklist progress

### 6.2 Bridal Planner (BridalPlanner.jsx)
**Kya hai:** Step-by-step wedding planning wizard.  
**Kyu banaya:** Brides ko ek structured flow dena jo unki wedding plan karne mein guide kare.  
**Flow:**
- Step 1: Wedding type select (Traditional, Destination, Modern, Court, Pre-Wedding)
- Step 2: Month, venue, style, budget, color palette choose
- Step 3: AI-style matching → matched artist list generate
- Step 4: Artists browse, filter, compare, cost estimate
- Step 5: Artist detail → services, packages → Book Now

### 6.3 Artists & Salons (ArtistsSalons.jsx)
**Kya hai:** Bridal vendor marketplace.  
**Features:**
- Artist cards with rating, location, match %, price
- Category tabs (All, Makeup, Hair, Mehndi, Outfit)
- Sort by Match %, Price, Rating, Experience
- AI Search — natural language query se artists search
- Portfolio carousel (images + videos)
- Availability checker with time slots
- Book Now flow (date → services → add-ons → confirm)
- Share profile + More options dropdown

### 6.4 Booking Details (BookingDetails.jsx)
**Kya hai:** Booking ke baad management screen.  
**Features:**
- Booking summary (artist, service, date, price, status)
- Reschedule — Change date/time modal + reason selector
- Cancel booking → degraded UI with red banner
- Add-ons — post-booking services add karo
- Invoice download as .txt file
- Status: Confirmed / Pending / Cancelled

### 6.5 AI Tools (AiToolsContainer.jsx)
**Kya hai:** 6 AI-powered bridal tools ek hi screen mein.  
**Tools:**
1. **Digital Twin** — AI bridal avatar with 6 makeup looks (Royal, Minimal, Glam, Boho, Classic, Modern)
2. **Makeup Lookbook** — Browse/customize makeup styles with lip, eye, hair, jewellery breakdown
3. **AI Chat** — OpenRouter API se wedding questions poocho
4. **Face Analyzer** — Face shape analysis + personalized recommendations
5. **Budget Optimizer** — Budget daalo → vendor suggestions
6. **Spot Eraser** — Photo upload/edit with zoom

### 6.6 Moodboard (MyMoodboard.jsx)
**Kya hai:** Visual inspiration board manager.  
**Features:**
- Grid view with images, titles, likes, pin counts
- Create Board — name, description, category tags, cover image
- Edit Board — details update, cover change
- Like/Unlike — localStorage persist
- Sort: Newest / Oldest / Most Liked
- More Menu: Edit, Duplicate, Share (copy link), Delete
- AI Generate button (toast placeholder)

### 6.7 Messages (Messages.jsx)
**Kya hai:** Chat simulation.  
**Features:**
- Conversation list with avatars, last message, unread count
- Chat bubbles, timestamps, file attachments
- Emoji picker for expressive messaging
- Send Inspiration — upload/share images
- Audio/Video call buttons (toast placeholders)
- Search conversations filter

### 6.8 Wallet & Offers (WalletOffers.jsx)
**Kya hai:** Financial dashboard.  
**Features:**
- Balance display + Add Money form
- Transaction history with dates
- Exclusive offers with coupon codes (copy to clipboard)
- Payment methods (cards/UPI) + Add New form
- Chat with Support navigation
- View All Offers toggle

### 6.9 Settings (SettingsPage.jsx)
**Kya hai:** Account management.  
**Tabs:**
- **Account** — Name, phone (+91), email, DOB, location, language
- **Notifications** — Email/Push/SMS/WhatsApp toggles
- **Privacy** — Profile visibility, activity status, data sharing
- **Payments** — Saved methods, add/edit, security
- **Preferences** — Wedding Prefs, Address Book, Sound, Language, Currency
- **Security** — Change Password, 2FA, Login Activity, Delete Account
- Theme toggle (Dark/Light), Save Changes, Logout

### 6.10 User Profile (UserProfile.jsx)
**Kya hai:** Personal profile page.  
**Features:**
- Profile photo upload/change (localStorage save)
- Inline name editing
- Membership badge (Standard/Elite)
- Tabs: Wedding, Beauty, Address, Payment
- Quick Actions: Style Quiz, View Moodboard, Journey Timeline
- Refer & Earn, Chat with Support

### 6.11 Package Details (PackageDetails.jsx)
**Kya hai:** Service package booking flow.  
**Steps:**
1. Package details, date/time, quantity select
2. Review order, promo code apply
3. Payment processing → Booking Confirmed

### 6.12 Login Page (LoginPage.jsx)
**Kya hai:** Authentication UI.  
**Features:** Email/Password login, Google login placeholder, Remember me, Register link

---

## 7. Data Persistence (Data Kaise Store hota hai?)

Backend nahi hai isliye saara data **localStorage** mein store hota hai. Har key ka unique prefix `noor_` hai.

| Key | Kya Store Karta Hai? | Kahan Use Hota Hai? |
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

## 8. Design System (Look & Feel)

### Colors
- **Primary:** Maroon/Dark Red (`#4A0404`, `#6B1020`) — bridal elegance represent karta hai
- **Accent:** Gold (`#C49F57`) — luxury aur celebration ka feel
- **Background:** Dark mode (#1a1a1a), Light mode (warm cream)
- **Buttons:** Gold-on-maroon gradients

### Typography
- **Headings:** Playfair Display (serif) — wedding elegance ke liye
- **Body:** Plus Jakarta Sans / Inter (sans-serif) — modern readability

### Visual Elements
- Dark mode first design (premium feel)
- Glassmorphism in modals
- Framer Motion animations (fade-in, slide-up, scale)
- 25+ bridal photography assets

---

## 9. File Structure (Project Kaise Organized Hai?)

```
BrideVerse AI/
│
├── index.html                  # Entry point (fonts, meta tags)
├── vite.config.js              # Vite build configuration
├── package.json                # Dependencies list
├── eslint.config.js            # Code quality rules
├── hackread.md                 # Yeh file — project documentation
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

## 10. How to Run (Project Chalaneka Tarika)

```bash
# Step 1: Dependencies install karo
npm install

# Step 2: Development server start karo
npm run dev
# → Browser automatically opens at http://localhost:5173

# Step 3: Production build ke liye
npm run build

# Step 4: Build preview ke liye
npm run preview
```

---

## 11. Testing

Abhi formal testing framework nahi hai (Jest/Cypress). Testing manual ki gayi hai:
- Har button click karke check kiya (functional)
- Build command run karke errors check kiye (`npm run build` → success)
- localStorage persist verify kiya (refresh ke baad data check)
- Responsive design check kiya (different screen sizes)

---

## 12. Challenges Faced (Kya Problems Aayi?)

| Challenge | Solution |
|---|---|
| **No backend** — saara data client-side store karna tha | localStorage use kiya, custom events (`profile_update`) se cross-component sync |
| **Buttun kaam nahi kar rahe the** — 40+ buttons sirf toast dikha rahe the | Har button ko actual functionality di — modals, localStorage save, clipboard copy, navigation |
| **Profile changes refresh pe lost ho jate the** | Har form field ka `useState` initializer localStorage se data read karta hai |
| **125vh typo** — Messages page scroll break ho raha tha | `125vh` → `100vh` fix kiya |
| **Review delete DOM manipulation tha** | Woh actual React state-based delete kiya |

---

## 13. Future Scope (Aage Kya Kar Sakte Hain?)

| Phase | Features | Technology |
|---|---|---|
| **Phase 1: Backend** | REST API, JWT auth, CRUD operations | Node.js + Express + MongoDB |
| **Phase 2: Real-time** | Live chat, booking updates, collaborative moodboard | Socket.io |
| **Phase 3: Payments** | Wallet top-up, invoice PDF, refunds | Razorpay/Stripe |
| **Phase 4: AI** | Real digital twin, smart budget optimization | Custom ML model |
| **Phase 5: Production** | TypeScript, React Router, PWA, code splitting | Various |

---

## 14. Conclusion

BrideVerse AI ek comprehensive bridal beauty marketplace hai jo modern frontend engineering principles demonstrate karta hai. 15+ interactive components, AI integration, dark mode, aur complete data persistence ke saath yeh ek functional prototype hai. Architecture deliberately modular aur clean rakha gaya hai taake bina backend ke bhi kaam kare, aur jab backend ready ho toh migrate karna easy ho.

---

*Built with React 19, Vite 8, Framer Motion — June 2026*
