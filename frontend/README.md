# SCRLL

SCRLL is a dark-themed social media application built with a Next.js frontend
and a Django REST Framework backend. Users can register, log in, create posts
with optional images, like posts, comment, edit/delete owned content, update
their profile bio, and open public user profiles from clickable usernames.

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4, TanStack Query,
  Zustand, Radix UI primitives, Phosphor Icons.
- Backend: Django 4.2, Django REST Framework, Simple JWT, django-cors-headers,
  SQLite locally, PostgreSQL-ready for production.

## Repository Layout

```text
frontend/
  src/app/                 Next.js routes and layouts
  src/components/ui/       Reusable UI primitives
  src/entities/            Domain APIs, hooks, types, base UI
  src/features/            Auth, post CRUD, comments, likes, bio update
  src/pages-fsd/           Page-level UI composition
  src/shared/              Providers, config, shared utilities
  src/widgets/             Feed, sidebar, profile, dialogs

backend/
  users/                   Auth and profile API
  posts/                   Post API
  comments/                Comment API
  likes/                   Like API
  scrll_project/           Django settings and root URLs
```

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

On Windows:

```bash
venv\Scripts\activate
```

### Frontend

Create `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Frontend Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server after build
```

If Turbopack is unstable on your machine:

```bash
npm run dev -- --webpack
```

## Environment Files

Examples are provided:

```text
frontend/.env.example
backend/.env.example
```

Frontend:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

Backend:

```env
SECRET_KEY=change-this-to-a-long-random-secret
DEBUG=false
ALLOWED_HOSTS=your-backend-domain.com
DATABASE_URL=postgres://user:password@host:5432/dbname
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.com
CORS_ALLOW_ALL_ORIGINS=false
```

## Routes

| Route               | Description          |
| ------------------- | -------------------- |
| `/login`            | Login page           |
| `/signup`           | Signup page          |
| `/`                 | Authenticated feed   |
| `/profile`          | Current user profile |
| `/users/[username]` | Public user profile  |

## API Overview

Base URL locally:

```text
http://localhost:8000
```

Protected requests use:

```http
Authorization: Bearer <access_token>
```

### Users

| Method  | Endpoint                    | Description                 |
| ------- | --------------------------- | --------------------------- |
| `POST`  | `/api/users/register/`      | Register                    |
| `POST`  | `/api/users/login/`         | Login and obtain JWT tokens |
| `POST`  | `/api/users/token/refresh/` | Refresh token               |
| `GET`   | `/api/users/me/`            | Current user                |
| `PATCH` | `/api/users/me/`            | Update current user bio     |
| `GET`   | `/api/users/<username>/`    | Public user profile         |

### Posts

| Method   | Endpoint           | Description          |
| -------- | ------------------ | -------------------- |
| `GET`    | `/api/posts/`      | Paginated feed       |
| `POST`   | `/api/posts/`      | Create post          |
| `GET`    | `/api/posts/me/`   | Current user's posts |
| `GET`    | `/api/posts/<id>/` | Get one post         |
| `PATCH`  | `/api/posts/<id>/` | Update owned post    |
| `DELETE` | `/api/posts/<id>/` | Delete owned post    |

### Comments

| Method   | Endpoint                         | Description          |
| -------- | -------------------------------- | -------------------- |
| `GET`    | `/api/comments/posts/<post_id>/` | List comments        |
| `POST`   | `/api/comments/posts/<post_id>/` | Create comment       |
| `PATCH`  | `/api/comments/<id>/edit/`       | Edit owned comment   |
| `DELETE` | `/api/comments/<id>/`            | Delete owned comment |

### Likes

| Method | Endpoint                             | Description      |
| ------ | ------------------------------------ | ---------------- |
| `POST` | `/api/likes/posts/<post_id>/toggle/` | Toggle post like |

## Deployment

The project is production-prepared for separate frontend/backend deployment.

Important production additions:

- Django reads `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, CORS, CSRF, and
  `DATABASE_URL` from environment variables.
- PostgreSQL is supported through `dj-database-url`.
- Static files can be served through WhiteNoise.
- Gunicorn is included for backend production serving.
- `backend/Procfile` is provided for platforms that support it.
- `frontend/.env.example` and `backend/.env.example` are included.

Read the full step-by-step guide:

```text
frontend/DEPLOYMENT.md
```

## Known Limitations

- Public profile posts are currently loaded by filtering posts by username on
  the frontend. A dedicated backend endpoint like `/api/users/<username>/posts/`
  would be better for large datasets.
- Uploaded images need persistent storage in production. Use a persistent disk
  or object storage.
- Auth protection is mainly client-side in the frontend.
- SQLite is only suitable for local development.

## Production Checklist

- Set `DEBUG=false`.
- Set a strong `SECRET_KEY`.
- Set exact `ALLOWED_HOSTS`.
- Set exact `CORS_ALLOWED_ORIGINS`.
- Use PostgreSQL or another production database.
- Configure persistent media storage.
- Use HTTPS for frontend and backend.
- Run backend migrations.
- Build frontend with `npm run build`.
