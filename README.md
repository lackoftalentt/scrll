# SCRLL

SCRLL is a small social media application with a modern dark interface. It lets
users register, sign in, publish posts with optional images, like posts, comment
on discussions, edit/delete owned content, update their profile bio, and open
public user profiles from clickable usernames.

The repository is split into a Next.js frontend and a Django REST Framework
backend.

## Features

- JWT-based authentication.
- Login and signup pages.
- Infinite home feed with paginated posts.
- Post creation, editing, deletion, image upload, likes, and comments.
- Comment creation, editing, and deletion.
- User profile page with email, bio, join date, and personal posts.
- Public user profile pages at `/users/[username]`.
- Clickable usernames in posts, comments, and comment dialogs.
- Dark theme built with Tailwind CSS, shadcn-style UI primitives, and Phosphor
  icons.
- Client-side cache updates through TanStack Query for likes and comment
  counters.

## Tech Stack

### Frontend

- Next.js `16.2.6` with the App Router.
- React `19.2.4`.
- TypeScript.
- Tailwind CSS v4.
- TanStack Query v5.
- Zustand for auth state.
- Radix UI primitives through local UI components.
- Phosphor Icons.

### Backend

- Django `4.2.7`.
- Django REST Framework `3.14.0`.
- Simple JWT.
- django-cors-headers.
- SQLite for local development.

## Project Structure

```text
frontend/
  src/
    app/                    Next.js App Router pages and layouts
    components/ui/          Reusable UI primitives
    entities/               Domain models, API functions, hooks, and base UI
    features/               User actions such as auth, likes, comments, post CRUD
    pages-fsd/              Page-level UI composition
    shared/                 Shared API constants, providers, config, utilities
    widgets/                Larger UI sections such as feed, sidebar, profile blocks

backend/
  users/                    Custom user model, auth, profile endpoints
  posts/                    Post models, serializers, views, routes
  comments/                 Comment models, serializers, views, routes
  likes/                    Like models, serializers, toggle endpoint
  scrll_project/            Django project settings and root URLs
```

The frontend follows an FSD-inspired organization: `entities` hold domain-level
building blocks, `features` implement specific interactions, and `widgets`
compose larger screen sections.

## Requirements

- Node.js compatible with Next.js 16.
- npm.
- Python 3.12 or compatible Python 3 version.
- pip.

## Environment Variables

Create `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The backend currently uses local Django settings in
`backend/scrll_project/settings.py`. For production, move sensitive values such
as `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, CORS settings, and database
configuration into environment variables.

## Installation

From the frontend directory:

```bash
npm install
```

From the backend directory:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
```

On Windows, activate the virtual environment with:

```bash
venv\Scripts\activate
```

## Running Locally

Start the backend:

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:3000
```

If port `3000` is busy, Next.js may choose another port. If Turbopack is
unstable on your machine, run:

```bash
npm run dev -- --webpack
```

## Scripts

Frontend scripts:

```bash
npm run dev      # Start Next.js development server
npm run build    # Create a production build
npm run start    # Start the production server after build
```

Backend commands:

```bash
python manage.py runserver
python manage.py migrate
python manage.py createsuperuser
```

## Frontend Routes

| Route               | Description                     |
| ------------------- | ------------------------------- |
| `/login`            | Sign in page                    |
| `/signup`           | Account registration page       |
| `/`                 | Authenticated home feed         |
| `/profile`          | Current user profile            |
| `/users/[username]` | Public profile for another user |

Authenticated pages are protected by client-side auth state. If there is no
access token, profile-related UI shows an unavailable state.

## Backend API

Base URL in local development:

```text
http://localhost:8000
```

### Users

| Method  | Endpoint                    | Description                          |
| ------- | --------------------------- | ------------------------------------ |
| `POST`  | `/api/users/register/`      | Register a user                      |
| `POST`  | `/api/users/login/`         | Obtain JWT access and refresh tokens |
| `POST`  | `/api/users/token/refresh/` | Refresh JWT token                    |
| `GET`   | `/api/users/me/`            | Get current user profile             |
| `PATCH` | `/api/users/me/`            | Update current user profile bio      |
| `GET`   | `/api/users/<username>/`    | Get public user profile by username  |

### Posts

| Method   | Endpoint           | Description          |
| -------- | ------------------ | -------------------- |
| `GET`    | `/api/posts/`      | Paginated post feed  |
| `POST`   | `/api/posts/`      | Create a post        |
| `GET`    | `/api/posts/me/`   | Current user's posts |
| `GET`    | `/api/posts/<id>/` | Get one post         |
| `PATCH`  | `/api/posts/<id>/` | Update an owned post |
| `DELETE` | `/api/posts/<id>/` | Delete an owned post |

### Comments

| Method   | Endpoint                         | Description              |
| -------- | -------------------------------- | ------------------------ |
| `GET`    | `/api/comments/posts/<post_id>/` | List comments for a post |
| `POST`   | `/api/comments/posts/<post_id>/` | Create a comment         |
| `PATCH`  | `/api/comments/<id>/edit/`       | Edit an owned comment    |
| `DELETE` | `/api/comments/<id>/`            | Delete an owned comment  |

### Likes

| Method | Endpoint                             | Description           |
| ------ | ------------------------------------ | --------------------- |
| `POST` | `/api/likes/posts/<post_id>/toggle/` | Toggle like on a post |

All protected endpoints expect:

```http
Authorization: Bearer <access_token>
```

## Data Models

### User

```ts
type User = {
	id: number
	username: string
	email: string
	bio: string
	created_at: string
}
```

### Post

```ts
type Post = {
	id: number
	author: string
	content: string
	image: string | null
	is_owner: boolean
	likes_count: number
	comments_count: number
	is_liked: boolean
	created_at: string
}
```

### Comment

```ts
type Comment = {
	id: number
	post: number
	author: string
	content: string
	created_at: string
}
```

## Authentication Flow

1. A user logs in through `/login`.
2. The backend returns `access` and `refresh` JWT tokens.
3. Tokens are stored in `localStorage`.
4. Zustand keeps auth state in `useAuthStore`.
5. API requests send the access token in the `Authorization` header.
6. Logout clears local tokens and redirects to `/login`.

Token storage is implemented in:

```text
src/shared/lib/token-storage.ts
```

Auth state is implemented in:

```text
src/features/auth/model/auth-store.ts
```

## Query and Cache Behavior

TanStack Query is used for server state. Important query keys include:

- `['posts']` for the infinite home feed.
- `['my-posts']` for the current user's posts.
- `['user-posts', accessToken, username]` for public profile posts.
- `['comments', postId]` for post comments.
- `['current-user', accessToken]` for the current user profile.
- `['user-profile', accessToken, username]` for public user profile details.

Likes and comment counters are updated in cache so the interface responds
immediately without waiting for a full refetch.

## Styling

Global design tokens live in:

```text
src/app/globals.css
```

The application uses a permanent dark theme by applying the `dark` class at the
root layout. UI primitives are located in `src/components/ui/` and are styled
with Tailwind utility classes and CSS variables.

## Media Uploads

Posts can include an optional image. The frontend sends post create/update
requests as `FormData`. The backend serves media files from:

```text
backend/media/
```

During local development Django serves media through `MEDIA_URL = /media/`.

## Known Limitations

- Public profile posts are currently derived on the frontend by loading posts
  and filtering by username. A dedicated backend endpoint such as
  `/api/users/<username>/posts/` would be more efficient for large datasets.
- Auth protection is client-side. Production applications should add server-side
  route protection or middleware where appropriate.
- SQLite is used for local development. Use PostgreSQL or another production
  database for deployment.
- Backend settings currently contain development values and should be
  environment-driven before production deployment.

## Development Notes

- This project uses Next.js 16. Its APIs and conventions may differ from older
  versions. Read the local Next.js docs in `node_modules/next/dist/docs/` before
  changing framework-specific behavior.
- Avoid committing local databases, media uploads, `.env` files, and virtual
  environments.
- Keep frontend API URLs centralized in `src/shared/api/constants.ts`.
- Prefer updating TanStack Query cache for small UI counters instead of forcing
  full refetches.

## Troubleshooting

### Frontend feels slow in development

Next.js development mode can be CPU-heavy, especially on low-power processors.
Try:

```bash
npm run dev -- --webpack
```

Also close unused browser tabs and background processes.

### Google Fonts fail during build

`next/font/google` needs network access during production builds. If the build
runs in a restricted environment, allow network access or switch to locally
hosted fonts.

### API requests fail

Check:

- Backend is running at `http://localhost:8000`.
- `NEXT_PUBLIC_API_URL` is set correctly.
- The user is logged in and has a valid JWT access token.
- CORS settings allow the frontend origin.

## Deployment

The project has been prepared for production deployment:

- Django reads production settings from environment variables.
- PostgreSQL is supported through `DATABASE_URL`.
- Static files are ready for `collectstatic` and WhiteNoise.
- Gunicorn is included for backend serving.
- Example env files are provided for frontend and backend.
- A backend `Procfile` is included.
- Ignore files prevent env files, local databases, media uploads, build output,
  and virtual environments from being committed.

Read the full guide:

```text
frontend/DEPLOYMENT.md
```

## Deployment Checklist

- Replace Django `SECRET_KEY`.
- Set `DEBUG = False`.
- Configure `ALLOWED_HOSTS`.
- Restrict CORS origins.
- Use a production database.
- Configure static and media file hosting.
- Set production frontend environment variables.
- Run migrations.
- Build the frontend with `npm run build`.
