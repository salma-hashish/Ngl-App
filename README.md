# NGL-App

Backend API for an anonymous messaging platform built with Express, MongoDB (Mongoose), Redis, JWT, and Zod.

## Features

- **Authentication**: Registration with email OTP verification, login, Google OAuth login, token refresh, forgot password, and idempotent password reset.
- **2-Step Verification**: Authenticated users can enable/disable 2-step verification on login via email OTP.
- **User Management & Moderation**: Profile viewing/updating, file uploads (avatar/CV with magic-number validation), and admin-only ban/unban endpoints.
- **Anonymous Messaging**: Send anonymous messages (up to 200 characters) and view incoming messages with sender identity hidden.
- **Identity Requests & Conversations**: Receivers can request sender identity; once accepted, sender identity is revealed and a conversation between both participants is created (up to 1000 characters per message, with optional pagination via `?page=&limit=`).
  - *Note*: Rejected identity requests cannot be re-requested for the same message in order to protect the sender's privacy.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   > **Important**: `JWT_SECRET` is required when `NODE_ENV=production`; the application refuses to start in production without it.

3. Start MongoDB and Redis, then run the server:
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

## Running Tests

```bash
npm test
```

## API Overview

Base prefix: `/api` (plus `/health` for health checks)

### Auth (`/api/auth`, rate-limited)
- `POST /api/auth/register` — Register a new user and send verification OTP
- `PATCH /api/auth/verify-account` — Verify account with email + OTP
- `POST /api/auth/login` — Login (returns JWT or triggers 2-step OTP if enabled)
- `POST /api/auth/verify-to-login` — Complete 2-step login with email + OTP
- `PATCH /api/auth/enable-2-step-verification` — Enable 2-step verification (requires auth)
- `POST /api/auth/forgot-password` — Request password reset OTP
- `POST /api/auth/send-otp` — Send OTP for `verify-account`, `reset-password`, or `2step-login`
- `PATCH /api/auth/reset-password` — Reset password with OTP (supports `idempotency-key` / `x-idempotency-key`)
- `POST /api/auth/login-with-google` — Login/register via Google
- `POST /api/auth/refresh-token` — Refresh JWT

### Users (`/api/user`, requires auth)
- `GET /api/user/profile` — Get current user's profile
- `PATCH /api/user/profile` — Update current user's profile
- `PATCH /api/user/2step/enable` | `PATCH /api/user/2step/disable` | `PATCH /api/user/2step` — Manage 2-step verification
- `PATCH /api/user/ban/:id` — Ban a user (admin only)
- `PATCH /api/user/unban/:id` — Unban a user (admin only)
- `PATCH /api/user/upload-profile-pic` — Upload profile picture
- `PATCH /api/user/upload-cv` — Upload CV (PDF/DOC)
- `GET /api/user` — List all active users
- `GET /api/user/:id` — Get user by ID

### Messages & Conversations (`/api/message`, requires auth)
- `POST /api/message/send` — Send an anonymous message
- `GET /api/message/incoming` — List incoming messages (sender hidden unless revealed)
- `GET /api/message/:id` — Get a single message
- `POST /api/message/:id/request-identity` — Request sender identity for a received message
- `GET /api/message/requests` — View identity requests received by you (as sender)
- `GET /api/message/requests/sent` — View identity requests sent by you (as receiver)
- `PATCH /api/message/request/:id/accept` — Accept identity request & create conversation
- `PATCH /api/message/request/:id/reject` — Reject identity request
- `GET /api/message/conversations` — List user's conversations
- `POST /api/message/conversation/:id/messages` — Send a message in a conversation
- `GET /api/message/conversation/:id` — Get conversation & messages (supports `?page=1&limit=20`)
