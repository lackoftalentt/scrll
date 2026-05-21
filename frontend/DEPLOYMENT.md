# SCRLL Deployment Guide

This guide describes a practical production deployment using:

- Backend: Django REST API on Render, Railway, Fly.io, or any Gunicorn-capable Python host.
- Database: PostgreSQL.
- Frontend: Next.js on Vercel, Netlify, Railway, or any Node host.

The frontend and backend are deployed as separate services.

## 1. Prepare Production Values

Choose final domains:

```text
Frontend: https://your-frontend-domain.com
Backend:  https://your-backend-domain.com
```

Generate a Django secret key:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 2. Backend Environment Variables

Set these variables in your backend hosting dashboard:

```env
SECRET_KEY=your-generated-secret-key
DEBUG=false
ALLOWED_HOSTS=your-backend-domain.com
DATABASE_URL=postgres://user:password@host:5432/dbname
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.com
CORS_ALLOW_ALL_ORIGINS=false
```

If your host gives you a PostgreSQL URL, paste it into `DATABASE_URL`.

## 3. Backend Build and Start Commands

Use these commands for a Python host.

Build command:

```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
```

Start command:

```bash
gunicorn scrll_project.wsgi:application
```

If your platform supports `Procfile`, it can use:

```text
web: gunicorn scrll_project.wsgi:application
```

## 4. Backend Root Directory

If the platform asks for a root directory, set it to:

```text
backend
```

## 5. Frontend Environment Variables

Set this variable in your frontend hosting dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

Do not include a trailing slash.

## 6. Frontend Build Settings

If the platform asks for a root directory, set it to:

```text
frontend
```

Install command:

```bash
npm ci
```

Build command:

```bash
npm run build
```

Start command for Node hosts:

```bash
npm run start
```

For Vercel, the framework preset should be Next.js and Vercel will handle the start command.

## 7. Local Production Check

Backend:

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
gunicorn scrll_project.wsgi:application
```

Frontend:

```bash
cd frontend
npm ci
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run build
npm run start
```

Open:

```text
http://localhost:3000
```

## 8. Media Uploads

Post images are stored in Django `MEDIA_ROOT`. Local development serves them from `/media/`.

For production, use persistent disk storage or object storage. If your backend host has an ephemeral filesystem, uploaded images may disappear after redeploys. Prefer one of these:

- Render persistent disk.
- Railway volumes.
- S3-compatible storage.
- Cloudinary.

If you keep local media storage, mount persistent storage to:

```text
backend/media
```

## 9. CORS Checklist

If the frontend cannot call the API:

1. Confirm `NEXT_PUBLIC_API_URL` points to the backend domain.
2. Confirm `CORS_ALLOWED_ORIGINS` contains the exact frontend origin.
3. Confirm `ALLOWED_HOSTS` contains the backend host.
4. Redeploy both services after changing environment variables.

Correct examples:

```env
ALLOWED_HOSTS=scrll-api.onrender.com
CORS_ALLOWED_ORIGINS=https://scrll.vercel.app
CSRF_TRUSTED_ORIGINS=https://scrll.vercel.app
NEXT_PUBLIC_API_URL=https://scrll-api.onrender.com
```

## 10. Suggested Render + Vercel Flow

### Backend on Render

1. Create a PostgreSQL database.
2. Create a Web Service from the repository.
3. Set root directory to `backend`.
4. Set build command:

   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
   ```

5. Set start command:

   ```bash
   gunicorn scrll_project.wsgi:application
   ```

6. Add the backend environment variables.
7. Deploy and copy the backend URL.

### Frontend on Vercel

1. Create a new Vercel project from the repository.
2. Set root directory to `frontend`.
3. Add:

   ```env
   NEXT_PUBLIC_API_URL=https://your-render-backend-url
   ```

4. Deploy.
5. Copy the frontend URL.
6. Go back to the backend and set:

   ```env
   CORS_ALLOWED_ORIGINS=https://your-vercel-frontend-url
   CSRF_TRUSTED_ORIGINS=https://your-vercel-frontend-url
   ```

7. Redeploy the backend.

## 11. Production Security Checklist

- `DEBUG=false`.
- Strong `SECRET_KEY`.
- Specific `ALLOWED_HOSTS`.
- Specific `CORS_ALLOWED_ORIGINS`.
- PostgreSQL or another production database.
- Persistent media storage.
- HTTPS on both frontend and backend.
- No `.env`, SQLite database, virtual environment, or media uploads committed to Git.

## 12. Common Problems

### 502 or crashed backend

Check build logs and confirm all Python dependencies installed. Confirm `DATABASE_URL` is valid.

### Static admin files are missing

Confirm `collectstatic --noinput` ran during build.

### Login works locally but not in production

Check that `NEXT_PUBLIC_API_URL` is the production backend URL and that CORS variables include the frontend URL.

### Uploaded images disappear

Your backend filesystem is likely ephemeral. Add persistent disk or external object storage.

### Frontend build fails on fonts

`next/font/google` needs network access during build. Allow build-time network access or switch to locally hosted fonts.
