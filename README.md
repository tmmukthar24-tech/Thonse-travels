# Thonse Tours and Travels

Full-stack premium travel website for **Thonse Tours and Travels**, Udupi, Karnataka.
Owner: Mukthar Ahmed · 8880954175

## Architecture & Structure

The project is structured as a unified full-stack application inside `client/`, allowing single-service deployment (e.g. Render, Railway, Fly.io, Heroku, DigitalOcean, VPS).

- `client/` — Full-stack application root
  - `src/` — React 18 + Vite + Tailwind CSS frontend
  - `server/` — Node.js + Express (ES modules) API backend
    - `server.js` — Serves all `/api` endpoints and the production static React build (`dist/`) with SPA fallback
    - `controllers/`, `routes/`, `models/`, `config/` — Modular backend services
    - `data/` — Local JSON file storage fallback whenever `MONGO_URI` is not set

## Running Locally

From `client/` (or repository root):

```bash
cd client
npm install
npm run dev
```

`npm run dev` starts both the Vite frontend (`http://localhost:5173`) and the Express backend (`http://localhost:5000`) concurrently.

### Other Available Scripts
- `npm run dev:client` — Runs only the Vite dev server
- `npm run dev:server` — Runs only the Express API with nodemon
- `npm run build` — Builds the production React frontend to `dist/`
- `npm start` — Starts the unified production Express server (serves UI + API on a single port)

## Single-Service Deployment

Deploy this repo as a single Web Service on any host (e.g., Render, Railway, Heroku):

- **Build Command**: `npm install && npm run build` (or `cd client && npm install && npm run build`)
- **Start Command**: `npm start` (or `cd client && npm start`)

The Express server listens on `process.env.PORT` (or 5000), serves all API endpoints under `/api/*`, and serves the compiled React frontend for all other routes.

## API Endpoints

- `GET /api/fleet` / `GET /api/fleet/:slug` — vehicle fleet
- `POST /api/bookings` / `GET /api/bookings` — ride bookings
- `POST /api/contact` / `GET /api/contact` — contact messages
- `POST /api/chatbot` — keyword-matched FAQ chatbot
- `GET /api/health` — health check

## Notes

- The hero background uses a CSS Ken-Burns animation on a still image.
  To switch to a real video, pass `videoSrc="/videos/hero.mp4"` to the
  `<Hero />` component instead of `imageSrc` (see `client/src/components/Hero.jsx`).
- All fleet data is served from the backend and fetched dynamically —
  never hardcoded in components.
