#!/usr/bin/env bash

echo "==> PartwiseForge setup starting..."

usage() {
  echo "Usage: $0 [--create-superuser]"
  echo "  --create-superuser   Create a Django superuser using env vars:"
  echo "                      DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD"
}

CREATE_SUPERUSER=false
if [[ ${1:-} == "--help" ]]; then
  usage
  exit 0
fi
if [[ ${1:-} == "--create-superuser" ]]; then
  CREATE_SUPERUSER=true
fi

require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: '$cmd' is not installed or not on PATH." >&2
    exit 1
  fi
}

echo "==> Checking prerequisites"
require_cmd python3
require_cmd poetry
require_cmd npm

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$ROOT_DIR/_server"
CLIENT_DIR="$ROOT_DIR/client"

echo "==> Installing Python dependencies (poetry)"
poetry install --no-root

echo "==> Installing frontend dependencies (npm)"
pushd "$CLIENT_DIR" >/dev/null
npm install
popd >/dev/null

echo "==> Ensuring _server/.env exists"
if [[ -f "$SERVER_DIR/.env" ]]; then
  echo "    _server/.env already present"
else
  if [[ -f "$SERVER_DIR/.env.example" ]]; then
    cp "$SERVER_DIR/.env.example" "$SERVER_DIR/.env"
    echo "    Created _server/.env from example"
  else
    echo "ASSET_URL=http://localhost:5173" > "$SERVER_DIR/.env"
    echo "    Created _server/.env with default ASSET_URL"
  fi
fi

echo "==> Applying Django migrations"
poetry run python "$SERVER_DIR/manage.py" migrate

if [[ "$CREATE_SUPERUSER" == true ]]; then
  echo "==> Creating Django superuser (non-interactive)"
  : "${DJANGO_SUPERUSER_USERNAME:?Set DJANGO_SUPERUSER_USERNAME}"
  : "${DJANGO_SUPERUSER_EMAIL:?Set DJANGO_SUPERUSER_EMAIL}"
  : "${DJANGO_SUPERUSER_PASSWORD:?Set DJANGO_SUPERUSER_PASSWORD}"
  # Export for manage.py to read
  export DJANGO_SUPERUSER_USERNAME DJANGO_SUPERUSER_EMAIL DJANGO_SUPERUSER_PASSWORD
  poetry run python "$SERVER_DIR/manage.py" createsuperuser --noinput || {
    echo "    Superuser creation may have failed (user might already exist)."
  }
fi

echo "==> Setup complete"
echo "Next steps:"
echo "  - Start Vite:   (cd client && npm run dev)"
echo "  - Start Django: poetry run python _server/manage.py runserver"
echo "  - Visit:        http://localhost:8000"
