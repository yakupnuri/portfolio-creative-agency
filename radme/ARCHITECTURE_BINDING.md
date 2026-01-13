# ARCHITECTURE (Binding)

## Purpose
Full-stack portfolio + creative agency website with public site + admin panel + backend API.

## Stack
- Frontend (Public + Admin): React 19, TypeScript, Tailwind, React Router, Vite
- Backend: Node.js + Express (TypeScript)
- DB: MongoDB (Mongoose)
- Auth (Admin): JWT + HTTP-only cookies + RBAC (owner/admin/editor)
- Media: Cloudinary (primary) + local fallback, optional Pixabay import
- Dev ports: Public 3000, Admin 3001, API 4000

## Key Modules
- Public: Home, Portfolio list, Project detail, Services, Contact, Brief flow
- Admin: Login, Dashboard, Projects CRUD, Categories CRUD, Media Library, Briefs, Client refs, Site content, Users (owner)
- Backend: /api/public/*, /api/brief, /api/admin/*, /api/setup/status + /api/setup (initial setup wizard)

## Architecture Rules
- Keep public + admin frontends separate; share API via services layer
- No secrets in repo; all secrets via env or setup config
- All user-facing strings must be i18n (TR/NL/EN)
- API responses must follow one consistent shape across endpoints
- Soft-delete where applicable (no hard delete unless explicitly required)
