# Flashcards

Create, study and share flashcard decks. Build decks in the app or import them from JSON, study one card at a time with flip and shuffle, and share decks by link.

Built with Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, Drizzle ORM, PostgreSQL 18 and Better Auth (GitHub and Google sign-in).

## Run with Docker Compose

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine with Compose v2). Nothing else is needed; Node.js runs inside the containers.

1. **Clone** the repository and open a terminal in it.

2. **Create `.env`** from the template:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell: `Copy-Item .env.example .env`

3. **Set `BETTER_AUTH_SECRET`** in `.env` to a random string of at least 32 characters. Either of these prints one:

   ```bash
   openssl rand -base64 32
   ```

   ```powershell
   $b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)
   ```

4. **(Optional) Add OAuth keys** so people can sign in. See [Sign-in setup](#sign-in-setup) below. Without them the app still runs and anyone can browse and study public decks. Creating decks requires sign-in.

5. **Start everything:**

   ```bash
   docker compose up -d --build
   ```

   This starts three services:

   | Service | What it does |
   |---|---|
   | `db` | PostgreSQL 18. Data is kept in the `db-data` volume. |
   | `migrate` | Applies database migrations, then exits. |
   | `app` | The production build of the web app on port 3000. It starts after `migrate` succeeds. |

6. Open **http://localhost:3000**.

Useful commands:

```bash
docker compose ps                 # status of the services
docker compose logs -f app        # follow the app's logs
docker compose down               # stop (keeps your data)
docker compose down -v            # stop and DELETE all data
docker compose up -d --build      # rebuild after pulling new code
```

## Sign-in setup

Sign-in uses OAuth. Each provider is enabled only when both of its keys are set in `.env`, so you can use GitHub only, Google only or both. After changing `.env`, restart the app: `docker compose up -d app` (or restart `npm run dev`).

### GitHub

1. Go to https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**.
2. **Homepage URL:** `http://localhost:3000`
   **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
3. Register it, copy the **Client ID**, then **Generate a new client secret** and copy it.
4. Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `.env`.

### Google

1. In https://console.cloud.google.com create (or pick) a project.
2. **APIs & Services → OAuth consent screen:** choose **External** and fill in the app name and emails.
3. **Credentials → Create credentials → OAuth client ID → Web application:**
   - **Authorized JavaScript origins:** `http://localhost:3000`
   - **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`
4. Copy the client ID and secret into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
5. While the app is in **Testing** mode, add your Google account under **Audience → Test users** (or publish the app).

Use `http://localhost:3000` exactly: `127.0.0.1` counts as a different origin. For a real domain, set `BETTER_AUTH_URL` to it (for example `https://flashcards.example.com`) and register that domain's callback URLs as well.

## Local development

For day-to-day work, run only the database in Docker and the app on your machine, which gives fast hot reload. The Next.js docs advise against running the dev server inside Docker on Windows and macOS.

**Requirements:** Docker, and Node.js 24.

```bash
npm install
cp .env.example .env      # then fill it in as described above
npm run db:up             # start PostgreSQL in Docker
npm run db:migrate        # create the tables
npm run dev               # http://localhost:3000
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run typecheck` | Regenerate Next.js route types, then `tsc` |
| `npm test` | Unit tests and database integration tests (needs `npm run db:up`) |
| `npm run db:up` | Start PostgreSQL in Docker |
| `npm run db:generate` | Create a migration after editing `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:studio` | Browse the database in Drizzle Studio |

The integration tests use a separate `flashcard_test` database in the same Postgres container. It is created and migrated automatically and never touches your development data.

## Importing decks from JSON

On **New deck → Import JSON**, upload a `.json` file like this (download it from `/deck-example.json`):

```json
{
  "title": "Spanish Basics",
  "description": "Common greetings",
  "visibility": "private",
  "cards": [
    { "front": "Hola", "back": "Hello" },
    { "front": "Gracias", "back": "Thank you" }
  ]
}
```

- `title` and `cards` are required; `description` and `visibility` (`"private"` or `"public"`) are optional.
- Limits: title up to 200 characters, description up to 2,000, 1–1,000 cards, up to 5,000 characters per card side, file up to 1 MB.
- **Export** on any deck page downloads it in the same format.
- The import page also has a **Generate a deck with AI** prompt that tells an AI assistant exactly how to write a valid file.

## Troubleshooting

| Problem | Fix |
|---|---|
| `port is already allocated` for 5432 or 3000 | Another Postgres or app is using the port. Stop it, or stop this project's other copy with `docker compose down`. |
| "Sign-in isn't set up yet" on the sign-in page | No OAuth keys in `.env`. See [Sign-in setup](#sign-in-setup), then restart the app. |
| `redirect_uri_mismatch` from Google/GitHub | The callback URL must match exactly, including `http`, the port and no trailing slash. |
| Docker build log shows "You are using the default secret" | Expected: `.env` is deliberately not copied into the image. The running container gets the real secret from `docker compose`. |
| `npm test` says it can't reach Postgres | Start it with `npm run db:up`. |

More detail on the design and roadmap is in [docs/PLAN.md](docs/PLAN.md).
