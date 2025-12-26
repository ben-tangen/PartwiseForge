# PartwiseForge
PartwiseForge is a Django + Vite/React app with authentication and a hybrid MPA/SPA flow. The root view serves the SPA once a user signs in; sign-up/sign-in live on separate pages.

## Prerequisites
- python 3.12+
- poetry
- npm

## Quick start (recommended)
From the repo root:

```bash
source ./activate.sh   # activate Poetry environment in your shell
./setup.sh             # install backend/frontend deps, create .env, run migrations
./run.sh               # start Vite (5173) and Django (8000)
```

Note: If these scripts are not executable, give them execute permission first:

```bash
chmod +x ./activate.sh ./setup.sh ./run.sh
```

Then visit http://localhost:8000. Stop with Ctrl+C.

### Optional: create a superuser

```bash
source ./activate.sh
DJANGO_SUPERUSER_USERNAME=admin \
DJANGO_SUPERUSER_EMAIL=admin@example.com \
DJANGO_SUPERUSER_PASSWORD=changeme \
./setup.sh --create-superuser
```

## Script details
- `activate.sh` — sources the Poetry-managed virtualenv into your current shell (use this before running other scripts/commands).
- `setup.sh` — installs Python deps via Poetry, installs JS deps in `client/`, ensures `_server/.env` exists (from `.env.example` when present), and runs migrations. Accepts `--create-superuser` with the env vars above.
- `run.sh` — starts Vite and Django together. Flags:
   - `--vite-port <port>` (default 5173)
   - `--django-port <port>` (default 8000)
   - `--update-env` to rewrite `_server/.env` `ASSET_URL` to the chosen Vite port.

## Manual workflow (if needed)
```bash
source ./activate.sh
poetry install --no-root
cd client && npm install && cd ..
cp -n _server/.env.example _server/.env  # or create and set ASSET_URL=http://localhost:5173
poetry run python _server/manage.py migrate

cd client && npm run dev &
poetry run python _server/manage.py runserver
```

## Environment
`ASSET_URL` in `_server/.env` must point to the Vite dev server (default http://localhost:5173). `run.sh --update-env` will keep it in sync if you change ports.
