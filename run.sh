#!/usr/bin/env bash
set -euo pipefail

VITE_PORT=5173
DJANGO_PORT=8000
UPDATE_ENV=false

usage() {
  echo "Usage: $0 [--vite-port <port>] [--django-port <port>] [--update-env]"
  echo "  --vite-port <port>     Port for Vite dev server (default: 5173)"
  echo "  --django-port <port>   Port for Django runserver (default: 8000)"
  echo "  --update-env           Update _server/.env ASSET_URL to match vite port"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --vite-port)
      VITE_PORT="${2:-}"
      shift 2
      ;;
    --django-port)
      DJANGO_PORT="${2:-}"
      shift 2
      ;;
    --update-env)
      UPDATE_ENV=true
      shift 1
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

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

# Optionally update _server/.env to match selected Vite port
if [[ "$UPDATE_ENV" == true ]]; then
  mkdir -p "$SERVER_DIR"
  if [[ -f "$SERVER_DIR/.env" ]]; then
    if grep -q '^ASSET_URL=' "$SERVER_DIR/.env"; then
      sed -i "s|^ASSET_URL=.*$|ASSET_URL=http://localhost:${VITE_PORT}|" "$SERVER_DIR/.env"
    else
      echo "ASSET_URL=http://localhost:${VITE_PORT}" >> "$SERVER_DIR/.env"
    fi
    echo "==> Updated _server/.env ASSET_URL=http://localhost:${VITE_PORT}"
  else
    echo "ASSET_URL=http://localhost:${VITE_PORT}" > "$SERVER_DIR/.env"
    echo "==> Created _server/.env with ASSET_URL=http://localhost:${VITE_PORT}"
  fi
fi

echo "==> Starting Vite (port ${VITE_PORT})"
pushd "$CLIENT_DIR" >/dev/null
nohup npm run dev -- --port "$VITE_PORT" >/dev/null 2>&1 &
VITE_PID=$!
popd >/dev/null

cleanup() {
  echo "\n==> Shutting down..."
  # Kill Vite
  if [[ -n "${VITE_PID:-}" ]]; then
    kill "$VITE_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "==> Starting Django (port ${DJANGO_PORT})"
# Export ASSET_URL for this process so Django asset proxy sees correct port
export ASSET_URL="http://localhost:${VITE_PORT}"
poetry run python "$SERVER_DIR/manage.py" runserver "0.0.0.0:${DJANGO_PORT}"
