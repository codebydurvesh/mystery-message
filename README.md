# 🕵️ Mystery Message

> **🔗 Live Demo:** [mystery-message-beta.vercel.app](https://mystery-message-beta.vercel.app)
>
> **📣 LinkedIn Post:**
> > 🚀 Excited to share my latest project — **Mystery Message**!
> >
> > An anonymous feedback web app where anyone can send you honest, candid messages without revealing their identity. Built with **Next.js 15**, **MongoDB**, **NextAuth**, **Resend**, and **shadcn/ui** — featuring OTP email verification, AI-suggested messages, a personal shareable link, and full message management.
> >
> > 🔗 Try it live → [mystery-message-beta.vercel.app](https://mystery-message-beta.vercel.app)
> > 💻 Source code → [github.com/codebydurvesh/mystery-message](https://github.com/codebydurvesh/mystery-message)
> >
> > \#NextJS \#MongoDB \#FullStack \#WebDev \#OpenSource

---

## 📖 Overview

**Mystery Message** is a full-stack anonymous feedback platform built with **Next.js**. Users sign up, get a unique shareable profile link, and anyone — logged in or not — can send them anonymous messages through that link. The receiver can manage which messages they accept, view all received messages, and delete individual ones — all without senders ever revealing who they are.

---

## ✨ Features

### 🔐 Authentication & Verification
- **Sign Up** with a unique username, email, and password
- Real-time **username availability check** (debounced) as you type
- **Email OTP verification** via [Resend](https://resend.com) — a 6-digit code is sent to your inbox after sign-up
- **Sign In** with credentials through NextAuth.js
- **Protected routes** — unauthenticated users are redirected to `/signin`; unverified users are redirected to `/verify/:username`

### 📬 Anonymous Messaging
- Every user gets a **unique public profile URL**: `/u/<username>`
- **Anyone** (no account required) can visit this URL and send an anonymous message
- Messages are limited to **300 characters** with a live character counter
- The sender's identity is **never stored or revealed**

### 🤖 AI-Suggested Questions
- On the send-message page, users can fetch **AI-suggested question prompts** to inspire their anonymous messages
- Three random question suggestions are served from a curated dataset via `/api/suggest-messages`

### 🗂️ Dashboard
- View **all received messages** in a responsive card grid (1 / 2 / 3 columns)
- **Delete individual messages** with a single click (with instant UI update)
- **Copy your unique profile link** to clipboard with one click
- **Toggle message acceptance** — turn off incoming messages with a toggle switch; senders are notified the user is not accepting messages
- Unverified users see a prompt to verify their account before they can toggle message acceptance

### 🎨 UI & UX
- Built with **shadcn/ui** components (Card, Button, Switch, Separator, Form, Input, etc.)
- **Dark / light mode** support via `next-themes`
- Animated **carousel** on the homepage showcasing sample anonymous messages (auto-plays every 2 seconds)
- Subtle **conic-gradient animated button** on the landing page
- Toast notifications (via **Sonner**) for all success and error events
- Fully **responsive** layout — mobile-first design

---

## 🔄 Application Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEW USER FLOW                            │
│                                                                 │
│  1. Visit /signup                                               │
│     └─ Enter username (real-time uniqueness check), email,     │
│        and password → Submit                                    │
│                                                                 │
│  2. Account created (unverified) → Redirected to /verify/:user │
│     └─ OTP email sent via Resend                               │
│                                                                 │
│  3. Enter 6-digit OTP on /verify/:username                     │
│     └─ Account marked as verified → Redirected to /dashboard   │
│                                                                 │
│  4. Dashboard loads:                                            │
│     ├─ Profile link displayed & copyable                        │
│     ├─ Accept Messages toggle (ON by default)                  │
│     └─ Message grid (empty for a new user)                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      SENDER FLOW                                │
│                                                                 │
│  1. Receive a shared link → /u/<username>                       │
│                                                                 │
│  2. Type an anonymous message (up to 300 chars)                │
│     └─ Optionally click "Suggest" for AI-generated prompts     │
│                                                                 │
│  3. Hit "Send Message"                                          │
│     ├─ If user is accepting → message saved, success toast     │
│     └─ If user is not accepting → error shown to sender        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    RETURNING USER FLOW                          │
│                                                                 │
│  1. Visit /signin → Enter credentials → Redirected to /dashboard│
│                                                                 │
│  2. Dashboard shows all received messages                       │
│     ├─ Click "Copy" to copy profile URL                        │
│     ├─ Toggle acceptance on/off                                │
│     └─ Delete any message                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB via [Mongoose](https://mongoosejs.com) |
| **Auth** | [NextAuth.js v4](https://next-auth.js.org) (Credentials provider) |
| **Email** | [Resend](https://resend.com) + [React Email](https://react.email) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| **Carousel** | [Embla Carousel](https://www.embla-carousel.com) with Autoplay |
| **HTTP Client** | [Axios](https://axios-http.com) |
| **Toasts** | [Sonner](https://sonner.emilkowal.ski) |
| **Password Hashing** | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/
│   │   ├── page.tsx              # Landing page with carousel
│   │   ├── layout.tsx            # App layout with Navbar
│   │   ├── dashboard/page.tsx    # User dashboard
│   │   └── u/[username]/page.tsx # Public send-message page
│   ├── (auth)/
│   │   ├── signin/page.tsx       # Sign in form
│   │   ├── signup/page.tsx       # Sign up form
│   │   └── verify/[username]/page.tsx # OTP verification
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth route handler
│       ├── signup/               # Register new user + send OTP
│       ├── verify-code/          # Validate OTP
│       ├── chech-username-unique/# Check username availability
│       ├── accept-messages/      # GET/POST toggle acceptance
│       ├── send-message/         # Send anonymous message
│       ├── get-messages/         # Fetch all messages for user
│       ├── delete-message/       # Delete a specific message
│       └── suggest-messages/     # Return random question prompts
├── model/
│   └── User.ts                   # Mongoose User + Message schema
├── schemas/                      # Zod validation schemas
├── components/
│   ├── Navbar.tsx
│   ├── MessageCard.tsx
│   └── ui/                       # shadcn/ui components
├── emails/
│   └── VerificationEmail.tsx     # React Email OTP template
├── helpers/                      # sendVerificationEmail helper
├── lib/                          # dbConnect, auth options
├── data/                         # Sample messages & question sets
├── types/                        # ApiResponse type
└── middleware.ts                 # Route protection logic
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- A MongoDB database (Atlas free tier works)
- A [Resend](https://resend.com) account and API key

### 1. Clone the repository

```bash
git clone https://github.com/codebydurvesh/mystery-message.git
cd mystery-message
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
MONGO_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
NEXT_AUTH_SECRET=a_long_random_secret_string
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 API Reference

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/signup` | ❌ | Register a new user; sends OTP email |
| `POST` | `/api/verify-code` | ❌ | Verify OTP and activate account |
| `GET` | `/api/chech-username-unique` | ❌ | Check if a username is available |
| `GET` | `/api/accept-messages` | ✅ | Get current accept-messages setting |
| `POST` | `/api/accept-messages` | ✅ | Toggle accept-messages on/off |
| `POST` | `/api/send-message` | ❌ | Send an anonymous message to a user |
| `GET` | `/api/get-messages` | ✅ | Retrieve all messages for the signed-in user |
| `DELETE` | `/api/delete-message/:id` | ✅ | Delete a specific message by ID |
| `GET` | `/api/suggest-messages` | ❌ | Get 3 random AI-style question suggestions |

---

## 🔒 Security Highlights

- Passwords are hashed with **bcryptjs** before storage — plain-text passwords are never saved
- OTP codes are **time-limited** (stored with an expiry date)
- Route-level protection is enforced in **middleware.ts** — unauthenticated and unverified users are automatically redirected
- Session tokens are signed using `NEXT_AUTH_SECRET`

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">Made by <a href="https://github.com/codebydurvesh">Durvesh</a></p>
