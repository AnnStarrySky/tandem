# The Blind Kitten

**“The Blind Kitten”** is a platform for beginner programmers.  
It offers levels from easy to advanced, a glossary of terms, gamified practice, and skills for real-world work.

## Participants:

- **Angelina** (angelinavakkasova)
- **Anna** (annstarrysky)
- **Yuriy** (yuriyli)

## Deploy:

- https://tandem-pi.vercel.app/

## Backend:

- https://github.com/Yuriyli/TandemBackend

## Meeting Notes

- [Meeting 01 — Первое обсуждение проекта](./meeting-notes/meeting-01.md)
- [Meeting 02 — Выбор стека и распределение задач](./meeting-notes/meeting-02.md)
- [Meeting 03 — Обновление статуса по задачам](./meeting-notes/meeting-03.md)

# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

### Authentication Configuration

| Variable          | Description                           | Example                     |
| ----------------- | ------------------------------------- | --------------------------- |
| `NEXTAUTH_URL`    | Base URL of your application          | `http://localhost:3000`     |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js encryption | `AnySuperSecretString12345` |

### Backend Configuration

| Variable      | Description              | Example                  |
| ------------- | ------------------------ | ------------------------ |
| `BACKEND_URL` | Backend API endpoint URL | `http://localhost:5227/` |

### Development Options

| Variable        | Description                         | Default |
| --------------- | ----------------------------------- | ------- |
| `AUTH_USE_MOCK` | Use mock authentication for testing | `false` |

## Optional Environment Variables

### Authentication Providers

#### GitHub OAuth

| Variable                          | Description                                 |
| --------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_GITHUB_AUTH_ENABLED` | Enable/disable GitHub auth (`true`/`false`) |
| `GITHUB_ID`                       | GitHub OAuth App Client ID                  |
| `GITHUB_SECRET`                   | GitHub OAuth App Client Secret              |

#### Google OAuth

| Variable                          | Description                                 |
| --------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | Enable/disable Google auth (`true`/`false`) |
| `GOOGLE_CLIENT_ID`                | Google OAuth Client ID                      |
| `GOOGLE_CLIENT_SECRET`            | Google OAuth Client Secret                  |

# Running the project

#### Install dependencies

`npm install`

#### Run development server

`npm run dev`

#### Build for production

`npm run build`

#### Start production server

`npm start`
