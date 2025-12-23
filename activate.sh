#!/usr/bin/env bash
# Source this script to activate the Poetry-managed virtual environment.
# Usage: source ./activate.sh

# IMPORTANT: Do NOT set -e/-u/-o pipefail here; this script is sourced
# into the current shell, and altering shell options can break tab-completion
# or cause your shell to exit unexpectedly.

# Ensure the script is sourced, not executed
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  echo "This script must be sourced to affect your current shell."
  echo "Usage: source ./activate.sh"
  exit 1
fi

# Check for Poetry
if ! command -v poetry >/dev/null 2>&1; then
  echo "Poetry is not installed or not on PATH."
  echo "Install Poetry: https://python-poetry.org/docs/#installation"
  return 1
fi

# Get or create the Poetry venv path
VENV_PATH="$(poetry env info --path 2>/dev/null || true)"
if [[ -z "$VENV_PATH" || ! -d "$VENV_PATH" ]]; then
  echo "Creating Poetry virtual environment and installing dependencies..."
  poetry install --no-root || { echo "Poetry install failed"; return 1; }
  VENV_PATH="$(poetry env info --path 2>/dev/null)"
fi

# Activate the venv in current shell
if [[ -f "$VENV_PATH/bin/activate" ]]; then
  # shellcheck disable=SC1090
  source "$VENV_PATH/bin/activate"
  echo "Activated Poetry virtualenv: $VENV_PATH"
  python --version
else
  echo "Unable to find activate script at: $VENV_PATH/bin/activate"
  return 1
fi
