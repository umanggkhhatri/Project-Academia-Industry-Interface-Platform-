# Prashikshan — Academia-Industry Interface Platform

> **Bridging the gap between academic learning and industry requirements through NEP 2020-aligned internship programs.**

Prashikshan is a full-stack web platform that connects students, faculty, and industry partners in a single transparent system — enabling internship discovery, digital logbooks, NEP 2020 credit allocation, and performance analytics.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Key Features](#key-features)
- [Firebase Integration](#firebase-integration)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router + Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Icons | Lucide React, Heroicons |
| Auth & Database | Firebase Auth + Firestore |
| Fonts | Inter & Poppins via `next/font` |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home / landing page
│   ├── layout.tsx                # Root layout (Header + Footer + AuthProvider)
│   ├── globals.css
│   ├── login/[role]/             # Dynamic login — student | faculty | industry
│   ├── register/[role]/          # Dynamic registration
│   ├── student/                  # dashboard, internships, logbook, report, resume, profile, support
│   ├── faculty/                  # dashboard, logbook, report, profile
│   ├── industry/                 # dashboard, profile
│   └── api/                      # API route handlers
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Sticky navbar with smooth-scroll navigation
│   │   ├── Footer.tsx
│   │   └── DashboardSidebar.tsx  # Shared sidebar for all dashboards
│   ├── pages/                    # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── ChallengesSection.tsx
│   │   ├── KeyFeaturesSection.tsx
│   │   ├── WhyWeStandOutSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── FeedbackFormSection.tsx
│   ├── ui/                       # Button, Card, TabBar, AnimatedCounter
│   └── providers/AuthProvider.tsx
│
└── firebaseConfig.js             # Firebase init (Auth, Firestore, Google)
```

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login/[role]` | Login for student, faculty, or industry |
| `/register/[role]` | Registration for each role |
| `/student/dashboard` | Student main dashboard |
| `/student/internships` | Browse & apply for internships |
| `/student/logbook` | Daily internship logbook |
| `/student/report` | Progress reports |
| `/student/resume` | Resume builder |
| `/student/support` | Help & support |
| `/faculty/dashboard` | Faculty dashboard |
| `/faculty/logbook` | Review student logbooks |
| `/faculty/report` | Report generation |
| `/industry/dashboard` | Industry dashboard |
| `/industry/profile` | Company profile & settings |

---

## Key Features

**Students** — AI-powered internship matching, application tracking, digital logbook, NEP 2020 credit earning, resume builder.

**Faculty** — Student oversight dashboard, logbook review, analytics, and report generation.

**Industry** — Internship listings, application management, communication hub, engagement analytics.

**Platform-wide** — NEP 2020 compliance, real-time transparency, rural reach initiative (remote internships, offline support), and a public feedback system.

---

## Firebase Integration

`src/firebaseConfig.js` exports:

| Export | Purpose |
|---|---|
| `auth` | Firebase Authentication instance |
| `db` | Firestore database instance |
| `googleProvider` | Google OAuth provider |

`AuthProvider` wraps the entire app and exposes the current user via React Context.

> **Note:** Firebase config values in `firebaseConfig.js` are client-safe public identifiers. Secure your data with proper **Firestore Security Rules** before going to production.

---

## Getting Started

**Prerequisites:** Node.js 18+, npm 9+

```bash
git clone https://github.com/umanggkhhatri/Project-Academia-Industry-Interface-Platform-.git
cd Project-Academia-Industry-Interface-Platform-
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Description |
|---|---|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## Environment Variables

For production, move Firebase config to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Then update `firebaseConfig.js` to read from `process.env.NEXT_PUBLIC_*`.

---

© 2024 Prashikshan — Academia-Industry Interface. All rights reserved.
