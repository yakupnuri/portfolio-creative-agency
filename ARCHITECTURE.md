# Architecture - Portfolio & Creative Agency Website

## Project Overview

This is a full-stack portfolio and creative agency website with separate frontend applications for public users and administrators.

**Tech Stack:**
- **Frontend:** React with TypeScript, Tailwind CSS
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens with HTTP-only cookies
- **Media Storage:** Cloudinary (primary) + Local storage (fallback)
- **Deployment:** Vercel (frontend) + Node.js hosting (backend)

## Directory Structure

```
portfolio-&-creative-agency/
├── admin-spa/                    # Admin Panel Frontend
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service layer
│   │   ├── types/                # TypeScript type definitions
│   │   ├── App.tsx               # Main app with routing
│   │   └── main.tsx             # Entry point
│   ├── index.html                # Admin panel HTML
│   └── package.json
├── components/                   # Public Website Components
│   ├── home/                    # Homepage components
│   ├── Layout.tsx               # Main layout
│   └── Navbar.tsx               # Navigation
├── pages/                       # Public Website Pages
│   ├── Home.tsx
│   ├── Portfolio.tsx
│   ├── ProjectDetail.tsx
│   ├── Services.tsx
│   ├── Contact.tsx
│   └── BriefFlow.tsx
├── server/                       # Backend API
│   ├── models/                   # MongoDB schemas
│   ├── repositories/             # Data access layer
│   ├── routes/                   # API endpoints
│   ├── cloudinary.ts             # Cloudinary config
│   ├── configStore.ts            # Configuration management
│   ├── env.ts                   # Environment variables
│   ├── db.ts                    # Database connection
│   └── index.ts                # Server entry point
├── index.html                   # Public website HTML
└── package.json
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Users                              │
└─────────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
┌──────────────────────┐      ┌────────────────────────┐
│   Public Website     │      │   Admin Panel       │
│   (Port 3000)       │      │   (Port 3001)       │
│                     │      │                      │
│ - React 19          │      │ - React 19           │
│ - Tailwind CSS       │      │ - Tailwind CSS       │
│ - TypeScript        │      │ - TypeScript         │
│ - React Router      │      │ - React Router       │
└──────────────────────┘      └────────────────────────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                            ▼
                    ┌────────────────────────┐
                    │   Backend API       │
                    │   (Port 4000)       │
                    │                    │
                    │ - Express.js        │
                    │ - MongoDB          │
                    │ - Cloudinary       │
                    │ - Pixabay API      │
                    └────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌──────────────┐      ┌────────────────┐
        │  MongoDB     │      │  Cloudinary   │
        │  Database    │      │  Media Store  │
        └──────────────┘      └────────────────┘
```

## Frontend Architecture

### Public Website (`/`)

**Purpose:** Client-facing portfolio and creative agency website

**Key Features:**
- Homepage with hero section
- Portfolio showcase
- Project detail pages
- Services pages
- Contact form
- Brief request flow

**Routing:**
- `/` - Homepage
- `/portfolio` - Portfolio listing
- `/portfolio/:slug` - Project detail
- `/services` - Services page
- `/contact` - Contact page
- `/brief` - Brief request flow
- `/offer` - Get offer page

**State Management:**
- React Context for authentication
- Local state with React hooks
- URL-based state management

### Admin Panel (`/admin-spa`)

**Purpose:** Content management and administration

**Key Features:**
- Dashboard with statistics
- Project management (CRUD)
- Category management
- Media library
- Client references
- Site content management
- User management
- Brief management

**Routing:**
- `/` - Login page
- `/dashboard` - Main dashboard
- `/projects/list` - Project list
- `/projects/new` - New project
- `/projects/:id` - Edit project
- `/projects/categories` - Category management
- `/media` - Media library
- `/clients` - Client references
- `/briefs` - Brief requests
- `/users` - User management
- `/site-management/*` - Site content management

**Authentication:**
- JWT tokens stored in HTTP-only cookies
- Role-based access control (Owner, Admin, Editor)
- Protected routes wrapper component

**API Service Layer:**
```typescript
// src/services/api.ts
export const apiService = {
  async get(endpoint: string) { ... }
  async post(endpoint: string, body: any) { ... }
  async patch(endpoint: string, body: any) { ... }
  async delete(endpoint: string) { ... }
}
```

## Backend Architecture

### Server Setup (`/server/index.ts`)

**Express.js Configuration:**
- CORS configuration for multiple origins
- JSON parsing with 20MB limit
- Morgan logging middleware
- Cookie parser
- Static file serving for uploads

**Endpoints:**
- `/api/setup` - Initial setup endpoint
- `/api/setup/status` - Setup status check
- `/api/brief` - Public brief submission
- `/api/admin/*` - Admin API routes

### API Routes (`/server/routes/admin.ts`)

**Authentication Middleware:**
```typescript
requireAuth           // Validates JWT token
requireRole(role)     // Checks specific role
requireAnyRole(roles) // Checks if user has any of the roles
```

**Protected Routes:**

1. **Diagnostics**
   - `GET /diagnostics/cloudinary` - Test Cloudinary connection
   - `GET /diagnostics/pixabay` - Test Pixabay connection

2. **Media Library**
   - `GET /media/list` - List all media assets
   - `POST /media/upload` - Upload new media
   - `GET /media/cloudinary/list` - List Cloudinary assets
   - `POST /media/import/cloudinary` - Import from Cloudinary
   - `GET /media/pixabay/search` - Search Pixabay
   - `POST /media/import/pixabay` - Import from Pixabay
   - `PATCH /media/:id/edit` - Edit media metadata
   - `DELETE /media/:id` - Delete media

3. **Categories**
   - `GET /categories` - List all categories
   - `POST /categories` - Create new category
   - `PATCH /categories/:id` - Update category
   - `DELETE /categories/:id` - Delete category

4. **Projects**
   - `GET /projects` - List all projects
   - `GET /projects/:id` - Get single project
   - `POST /projects` - Create new project
   - `PATCH /projects/:id` - Update project
   - `DELETE /projects/:id` - Delete project (soft delete)

5. **Briefs**
   - `GET /briefs` - List all briefs
   - `GET /briefs/:id` - Get single brief
   - `PATCH /briefs/:id` - Update brief status
   - `DELETE /briefs/:id` - Delete brief

6. **Client References**
   - `GET /client-refs` - List client references
   - `POST /client-refs` - Create reference
   - `PATCH /client-refs/:id` - Update reference
   - `DELETE /client-refs/:id` - Delete reference

7. **Content Management**
   - `GET /content` - Get site content
   - `PATCH /content` - Update site content
   - Various content-specific endpoints (home, services, etc.)

8. **User Management**
   - `GET /users/me` - Get current user
   - `GET /users` - List all users (owner only)
   - `POST /users` - Create user (owner only)
   - `PATCH /users/:id` - Update user
   - `DELETE /users/:id` - Delete user (owner only)

### Database Models (`/server/models/`)

**Project Model:**
```typescript
{
  slug: string;
  year: string;
  coverImage: string;
  galleryImages: string[];
  isFeatured: boolean;
  categorySlug: string;
  published: boolean;
  translations: {
    tr: { title, category, description, client, role };
    nl: { title, category, description, client, role };
    en: { title, category, description, client, role };
  };
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
```

**Category Model:**
```typescript
{
  slug: string;
  isActive: boolean;
  translations: {
    tr: { name };
    nl: { name };
    en: { name };
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**MediaAsset Model:**
```typescript
{
  source: 'upload' | 'pixabay' | 'cloudinary';
  storage: 'local' | 'cloudinary';
  url: string;
  preview: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  alt: string;
  caption: string;
  tags: string[];
  cloudinary_public_id: string;
  local_path: string;
  createdAt: Date;
}
```

**Brief Model:**
```typescript
{
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  budgetRange: string;
  deadline: string;
  message: string;
  serviceSpecificData: Record<string, any>;
  status: string;
  createdAt: Date;
}
```

**ClientRef Model:**
```typescript
{
  clientName: string;
  projectTitle: string;
  testimonial: string;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**User Model:**
```typescript
{
  email: string;
  passwordHash: string;
  role: 'owner' | 'admin' | 'editor';
  name: string;
  createdAt: Date;
}
```

## Data Flow

### Project Creation Flow

```
User clicks "New Project"
    ↓
Navigate to /projects/new
    ↓
Form loads (ProjectsDetail component)
    ↓
User fills form data
    ↓
User clicks "Save"
    ↓
Frontend validation
    ↓
POST /api/admin/projects
    ↓
Backend validates data (Zod)
    ↓
Create MongoDB document
    ↓
Return success response
    ↓
Navigate to /projects/list
```

### Media Upload Flow

```
User opens Media Library
    ↓
Select tab (Local/Cloudinary/Pixabay)
    ↓
If uploading: POST /api/admin/media/upload
    ↓
Backend receives base64 file
    ↓
Upload to Cloudinary (if configured)
    ↓
Save metadata to MongoDB
    ↓
Return media URL
    ↓
User selects media for project
```

### Authentication Flow

```
User enters credentials
    ↓
POST /api/admin/auth/login
    ↓
Backend validates credentials
    ↓
Generate JWT token
    ↓
Set HTTP-only cookie
    ↓
Return user data
    ↓
Frontend stores user in context
    ↓
Protected routes check cookie
```

## Security Features

1. **Authentication:**
   - JWT tokens with expiration
   - HTTP-only cookies (XSS protection)
   - Secure cookies in production

2. **Authorization:**
   - Role-based access control
   - Protected routes middleware
   - Owner-only endpoints

3. **CORS:**
   - Whitelisted origins
   - Credentials support
   - Development/production configuration

4. **Validation:**
   - Zod schema validation
   - Input sanitization
   - Type safety with TypeScript

## Internationalization (i18n)

**Supported Languages:**
- TR (Türkçe)
- NL (Nederlands)
- EN (English)

**Implementation:**
- Translation objects in database models
- Language selector in admin panel
- URL-based language detection
- Fallback to TR if translation missing

## Deployment

### Development
```bash
# Backend
cd server && npm run server

# Public Website
npm run dev

# Admin Panel
npm run admin:dev
```

### Production
- Frontend: Vercel
- Backend: Node.js hosting (Render, Railway, etc.)
- Database: MongoDB Atlas
- Media: Cloudinary

## Environment Variables

```env
MONGODB_URI=                    # MongoDB connection string
CLOUDINARY_CLOUD_NAME=         # Cloudinary cloud name
CLOUDINARY_API_KEY=             # Cloudinary API key
CLOUDINARY_API_SECRET=          # Cloudinary API secret
PIXABAY_API_KEY=              # Pixabay API key (optional)
JWT_SECRET=                   # JWT signing secret
```

## Key Design Decisions

1. **Separate Frontend Apps:**
   - Public website and admin panel are separate applications
   - Allows independent deployment and scaling
   - Different build configurations

2. **Monolithic Backend:**
   - Single Express server for both frontends
   - Shared API routes
   - Centralized authentication

3. **Media Storage Strategy:**
   - Cloudinary as primary (CDN, optimization)
   - Local storage as fallback
   - Pixabay integration for stock photos

4. **Soft Deletes:**
   - `isDeleted` flag instead of actual deletion
   - Allows recovery of deleted items
   - Audit trail maintenance

5. **Multi-language Support:**
   - Translation objects in database
   - Language-agnostic slug field
   - Easy addition of new languages

## Performance Considerations

1. **Frontend:**
   - Code splitting with React Router
   - Lazy loading for large components
   - Image optimization with Cloudinary

2. **Backend:**
   - MongoDB indexing on frequently queried fields
   - Pagination for large lists
   - Caching strategy for static content

3. **Media:**
   - Cloudinary CDN delivery
   - Image format optimization
   - Responsive image generation

## Future Enhancements

1. Real-time notifications
2. Advanced search with filters
3. Analytics dashboard
4. Version history for content
5. Collaborative editing
6. Automated backups
7. Multi-server deployment
8. Rate limiting
9. API rate limiting
10. Redis caching layer