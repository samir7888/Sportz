# 🏆 Sportz - Real-Time Sports Live Commentary Platform

![Sportz Platform](https://img.shields.io/badge/Sportz-v0.1.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=for-the-badge&logo=drizzle)
![Pusher](https://img.shields.io/badge/Pusher-Real--time-312967?style=for-the-badge&logo=pusher)

Sportz is a high-performance, real-time sports commentary and match-tracking platform. Designed with a focus on visual excellence and technical precision, it offers a seamless experience for both sports fans and administrators.

---

## 🌟 Key Features

### 📡 Real-Time Live Commentary
Powered by **Pusher**, Sportz delivers instantaneous match updates. Whether it's a goal in a football match or a wicket in cricket, users receive updates without refreshing the page.

### 🏏 Multi-Sport Support
Tailored experiences for different sports:
- **Football:** Minute-by-minute updates, goal events, and match milestones.
- **Cricket:** Over-by-over tracking, run counting, wicket alerts, and actor-specific actions.

### 🛠️ Advanced CMS Dashboard
A dedicated Content Management System for match administrators:
- **Match Creation:** Seamlessly set up upcoming matches with team details and start times.
- **Live Scoring:** Update scores and wickets in real-time.
- **Dynamic Commentary:** Add detailed commentary events with specific metadata (event types, actors, etc.).
- **Ownership Management:** Secure match management where users can only edit matches they created.

### 🔐 Robust Authentication
Integrated with **Better-Auth** for secure session management, providing a seamless login/signup experience and protecting administrative routes.

### 🧹 Automated Match Cleanup
An automated cron system handles the deletion of finished matches after 6 hours, keeping the system optimized and the dashboard relevant.

---

## 🏗️ Architectural Excellence

Sportz is built following modern software engineering principles:

### 🧩 Core Components
- **`CommentaryCard`**: A dynamic component that renders sport-specific events (goals, wickets, runs) with customized icons and styling.
- **`TeamCard`**: Displays match status, live scores, and team details with a premium feel.
- **`Navbar`**: Responsive navigation with integrated authentication state handling.
- **`MatchManagement`**: A complex CMS interface for granular control over match data.

### 🛠️ Custom Hooks & Logic
- **`useAppMutation`**: A powerful wrapper around TanStack Query's `useMutation` that handles:
    - Automatic **toast notifications** for success and error states.
    - Intelligent **cache invalidation** based on custom tags.
    - Type-safe API interactions using Axios.
- **`apiService`**: A centralized service layer for all data fetching (fetchMatches, fetchLiveMatches, etc.), ensuring consistency across the application.

### 🗄️ Database Strategy
Using **Drizzle ORM** with **Neon Postgres**, we implement a relational schema that supports:
- **Cascade Deletes**: Automatically cleaning up commentary when a match is deleted.
- **JSONB Metadata**: Storing flexible event-specific data without rigid schema limitations.
- **Native Enums:** Ensuring data integrity for sports types and match statuses.

---

## 🚀 Tech Stack

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [TanStack Query v5](https://tanstack.com/query/latest)
- **Database & ORM:** [Neon (PostgreSQL)](https://neon.tech/), [Drizzle ORM](https://orm.drizzle.team/)
- **Real-time Engine:** [Pusher](https://pusher.com/)
- **Authentication:** [Better-Auth](https://better-auth.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Communication:** [Axios](https://axios-http.com/) & [Native Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- **Validation:** [Zod](https://zod.dev/)
- **Notifications:** [Sonner](https://sonner.stevenly.me/)

---

## 📂 Project Structure

```text
├── app/
│   ├── (auth)/          # Authentication flow (Login/SignUp)
│   ├── api/             # API routes (Matches, Commentary, Cron)
│   ├── cms/             # Administrative dashboard
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks (useAppMutation)
│   └── service/         # API abstraction layer
├── db/
│   ├── schema.ts        # Database definitions
│   └── index.ts         # DB client configuration
├── validations/         # Zod schemas for data safety
└── type.ts             # Centralized TypeScript interfaces
```

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/sportz.git
   cd sportz
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Create a `.env` file with:
   ```env
   DATABASE_URL=your_postgres_url
   NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
   PUSHER_APP_ID=your_pusher_id
   PUSHER_SECRET=your_pusher_secret
   BETTER_AUTH_SECRET=your_auth_secret
   CRON_SECRET=your_cron_secret
   ```

4. **Database Migration:**
   ```bash
   pnpm db:push
   ```

5. **Run Development Mode:**
   ```bash
   pnpm dev
   ```

---

## 🎨 Design Philosophy

Sportz is designed to feel alive. We use:
- **Glassmorphism & Gradients:** For a modern, high-end visual aesthetic.
- **Micro-animations:** Subtle hover effects and transitions that enhance engagement.
- **Semantic HTML:** For accessibility and SEO best practices.

---

## 📜 License

This project is licensed under the MIT License.

---

*Built with precision and passion for the game.*

