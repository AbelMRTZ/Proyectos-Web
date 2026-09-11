# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FilmLogger is a full-stack movie logging web app — a React SPA (client) backed by an Express API (server), both using Supabase for auth, database, and file storage.

## Development Commands

Run both servers concurrently in separate terminals:

```bash
# Backend (port 5000, hot-reload)
cd server && npm run dev

# Frontend (port 5173, HMR)
cd client && npm run dev
```

Other commands:
```bash
cd client && npm run build    # Production build → dist/
cd client && npm run preview  # Preview production build
cd client && npm run lint     # ESLint
cd server && npm start        # Production (no nodemon)
```

There is no test framework configured.

## Architecture

### Stack
- **Frontend:** React 19, React Router v7, Vite 7 (ESM)
- **Backend:** Express 5, Node.js (CommonJS)
- **Database & Auth:** Supabase (PostgreSQL + Auth + Storage)
- **File uploads:** Multer (memory storage) → Supabase Storage bucket `imagenes`

> **Note:** The server's in-code port fallback is `3000`; set `PORT=5000` in `server/.env` to match the frontend's `VITE_API_URL`. CORS is currently open (`app.use(cors())`); `CLIENT_URL` in `.env` is not yet wired up.

### Dual Supabase clients
- `server/supabase.js` — uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS, for backend operations)
- `client/src/supabaseClient.jsx` — uses `VITE_SUPABASE_ANON_KEY` (respects RLS, for auth)

### Authentication flow
1. User authenticates via Supabase Auth in `AuthContext.jsx` (email/password)
2. Frontend stores the JWT and attaches it as `Authorization: Bearer <token>` on API calls
3. `server/middleware/auth.middleware.js` verifies the token via `supabase.auth.getUser(token)`
4. User role is stored in `Perfiles.tipo` (`"admin"` grants movie creation access); `ProtectedRoute` component enforces this on the frontend

### Backend structure
```
server/index.js          → Express app, mounts all route groups under /api/*
server/routes/           → Route definitions (thin, delegate to controllers)
server/controllers/      → Business logic (DB queries via Supabase client)
server/middleware/       → auth.middleware.js (verifyToken)
server/services/         → storageService.js (Supabase Storage upload/delete)
server/config/multer.js  → 50 MB limit, accepts images + video, memory storage
```

### API routes
| Prefix | Resource |
|--------|----------|
| `/api/films` | Movies CRUD + media upload/delete |
| `/api/perfiles` | User profiles CRUD |
| `/api/comentarios` | Comments |
| `/api/calificaciones` | Ratings (1-10) |
| `/api/favoritas` | Favorites (toggle) |
| `/api/categorias` | Categories + film-category junction |
| `/api/imagenes` | Image management |
| `/api/health` | Health check |

### Frontend routing
| Path | Page | Auth required |
|------|------|--------------|
| `/` | Home (movie list) | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/resultados` | Search results | No |
| `/pelicula/:id` | Movie detail | No |
| `/crear-pelicula` | Create movie | Admin only |
| `/perfil` | User profile | Yes |
| `/Accesibilidad` | Accessibility settings | No |

### Accessibility & theming
- Theme (`default` / `dark` / `high-contrast`) and font size (`normal` / `large`) are set via `data-theme` and `data-font` attributes on `<html>`
- Values persisted to `localStorage` and synced to `Perfiles.accesibilidad` (encoded as a short string, e.g. `"c-p"`)
- `AuthContext.jsx` calls `loadAndApplyPerfil()` on login to rehydrate preferences

### File upload flow
1. Frontend sends `multipart/form-data` with `portada` (cover image) and/or `files` (media)
2. Multer buffers files in memory
3. `storageService.js` uploads to Supabase Storage with UUID filenames under `movies/{movieId}/portada` or `movies/{movieId}/media`
4. Storage paths and public URLs are saved to the `Contenido_Multimedia` table
5. On failure, uploaded files and DB records are rolled back (storage cleanup is best-effort)

## Environment Variables

**`server/.env`**
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

**`client/.env.local`** (development) / **`client/.env.production`** (production)
```
VITE_API_URL=http://localhost:5000   # or production IP
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Key Conventions

- Backend uses **CommonJS** (`require`/`module.exports`); frontend uses **ESM** (`import`/`export`)
- All frontend API calls should use `import.meta.env.VITE_API_URL` — avoid hardcoding `localhost:5000`
- CSS theming uses CSS custom properties defined in `client/src/css/variables.css`, scoped with `[data-theme]` selectors
- Supabase table names: `Films`, `Perfiles`, `Categoria_Film`, `Calificacion`, `Favoritas`, `Contenido_Multimedia`
- The accessibility code stored in `Perfiles.accesibilidad` encodes as `"{themeCode}-{fontCode}"` where theme codes are `c`→`default`, `o`→`dark`, `ac`→`high-contrast` and font codes are `p`→`normal`, `g`→`large` (decoded in `AuthContext.jsx`)
- The `/resultados` page fetches from `GET /api/films/filter` with query params: `titulo`, `director`, `estado`, `pais_produccion`, `calificacion` (all optional, case-insensitive `ilike` match except `calificacion`)
