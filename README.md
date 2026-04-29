# Insighta Labs — Web Portal

> Browser-based interface for the Insighta Labs Profile Intelligence Platform.
> Built with **React + Vite**. Authenticated via **GitHub OAuth**.

**Live Portal:** `https://your-insighta-web.vercel.app`
**Backend API:** `https://profile-intelligence-service-rcl7.vercel.app`

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Page routing |
| Axios | HTTP requests to backend |

---

## Pages

| Page | Route | Description |
|---|---|---|
| Login | `/` | GitHub OAuth — "Continue with GitHub" |
| Dashboard | `/dashboard` | Live metrics — total profiles, gender split, age groups |
| Profiles | `/profiles` | Table with filtering, sorting, pagination, CSV export |
| Profile Detail | `/profiles/:id` | Full profile info. Delete button for admins only |
| Search | `/search` | Natural language search with example queries |
| Account | `/account` | GitHub avatar, role badge, sign out |

---

## Authentication

- Login via **GitHub OAuth 2.0**
- Tokens stored in **HTTP-only cookies** — never accessible via JavaScript
- Protected routes redirect to login if session is missing
- Role-based UI — delete button only visible to `admin` users

---

## Local Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:5173`

> The backend must also be running on `http://localhost:8000`

---

## Environment Variables

```env
# Leave empty for local development
# Vite proxy in vite.config.js forwards /auth and /api to localhost:8000
VITE_API_BASE_URL=

# Set your deployed backend URL for production
# VITE_API_BASE_URL=https://profile-intelligence-service-rcl7.vercel.app
```

---

## Deployment

1. Push to GitHub
2. Import into [Vercel](https://vercel.com) — framework preset: **Vite**
3. Add environment variable:
   - `VITE_API_BASE_URL` = https://profile-intelligence-service-rcl7.vercel.app
4. Deploy

After deploying, update `FRONTEND_URL` in your backend's Vercel environment
variables to point to your new web portal URL, then redeploy the backend.

---

## Related Repositories

| Repo | Description |
|---|---|
| [profile-intelligence-service](https://github.com/samstar001/profile-intelligence-service) | Backend API — FastAPI + PostgreSQL |
| [insighta-cli](https://github.com/samstar001/insighta-cli) | CLI tool — Python + Click |
| [insighta-web](https://github.com/samstar001/insighta-web) | This repo — Web Portal |