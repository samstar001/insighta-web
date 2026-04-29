# Insighta Web Portal

React web portal for the Insighta Labs Profile Intelligence Service.

## Tech Stack
- React 18
- Vite
- Axios
- React Router DOM

## Pages
- **Login** — GitHub OAuth authentication
- **Dashboard** — Key metrics and overview
- **Profiles** — Browse, filter, sort and paginate profiles
- **Profile Detail** — Full profile information
- **Search** — Natural language search
- **Account** — Current user information

## Authentication
- Uses HTTP-only cookies (tokens never accessible via JavaScript)
- Auto-refreshes expired tokens
- Protected routes redirect to login if not authenticated

## Running Locally

```bash
npm install
npm run dev
```

Visit: http://localhost:5173

## Environment Variables

```env
VITE_API_BASE_URL=
```

Leave empty for local development (Vite proxy handles routing).
Set to your backend URL for production.

## Live URL
https://your-portal.vercel.app