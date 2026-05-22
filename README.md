# Project Presentation — SCRLL

## 1. Project Title

**SCRLL — Modern Social Media Platform**

---

## 2. Problem the Project Solves

Many beginner social media projects only support basic posting and lack real interactive functionality.

SCRLL solves this by providing:

* User authentication
* Real-time social interactions
* Public profiles
* Likes and comments
* Image uploads
* Modern responsive UI

The project demonstrates how a full-stack social platform works using a modern frontend and REST API backend architecture.

---

## 3. Technologies Used

### Frontend

* Vercel Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* TanStack Query
* Zustand
* Radix UI
* Phosphor Icons

### Backend

* Django
* Django REST Framework
* Simple JWT
* SQLite
* django-cors-headers

---

## 4. Main Features

### Authentication

* User registration and login
* JWT token authentication
* Protected routes

### Posts

* Create posts
* Edit/delete own posts
* Upload images
* Infinite scrolling feed

### Social Features

* Like/unlike posts
* Add comments
* Edit/delete comments
* Clickable usernames

### Profiles

* Personal profile page
* Public user profiles
* User bio editing
* Join date display

### UI/UX

* Modern dark theme
* Responsive layout
* Instant UI updates with TanStack Query cache

---

## 5. Database Structure

### User

```ts
User {
  id
  username
  email
  bio
  created_at
}
```

### Post

```ts
Post {
  id
  author
  content
  image
  likes_count
  comments_count
  created_at
}
```

### Comment

```ts
Comment {
  id
  post
  author
  content
  created_at
}
```

### Like

```ts
Like {
  id
  user
  post
}
```

Relations:

* One user → many posts
* One post → many comments
* Many users ↔ many posts through likes

---

## 6. Project Architecture

### Frontend Structure

```text
entities/   -> business models and API logic
features/   -> user actions and interactions
widgets/    -> large UI sections
shared/     -> utilities and configs
```

### Backend Apps

```text
users/
posts/
comments/
likes/
```

The project uses a modular architecture to keep code maintainable and scalable.

---

## 7. API Structure

### Main REST Endpoints

#### Users

```text
/api/users/register/
/api/users/login/
/api/users/me/
```

#### Posts

```text
/api/posts/
/api/posts/<id>/
```

#### Comments

```text
/ api/comments/posts/<post_id>/
```

#### Likes

```text
/api/likes/posts/<post_id>/toggle/
```

---

## 8. Authentication Flow

1. User logs in
2. Backend returns JWT access and refresh tokens
3. Tokens stored in localStorage
4. Zustand manages auth state
5. API requests use Authorization header

```http
Authorization: Bearer <token>
```

---

## 9. Live Demonstration

### Demonstration Plan

* Register new account
* Login
* Create a post
* Upload image
* Like a post
* Add comment
* Open public profile
* Edit profile bio
* Delete post/comment

---

## 10. Challenges Faced

### Main Challenges

* JWT authentication handling
* Keeping frontend cache synchronized
* Managing optimistic UI updates
* Image upload with FormData
* Organizing scalable frontend architecture
* Handling infinite scrolling efficiently

---

## 11. Future Improvements

### Planned Features

* Real-time chat
* Notifications
* Follow system
* Server-side route protection
* PostgreSQL production database
* Better image optimization
* Dedicated endpoint for user posts
* Deployment to cloud hosting

---

## 12. Conclusion

SCRLL is a full-stack social media application built with modern technologies.

The project demonstrates:

* Full frontend/backend integration
* REST API development
* Authentication systems
* State management
* Database relationships
* Modern UI development

It also provides a strong foundation for scaling into a larger production-ready social platform.
