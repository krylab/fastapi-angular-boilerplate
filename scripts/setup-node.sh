#!/usr/bin/env bash
set -euo pipefail

# Pin Node.js 24 as the default runtime for this repo (Angular 22+ requires >=24.15 or >=22.22.3).
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "nvm is not installed (expected at $NVM_DIR)." >&2
  exit 1
fi

# shellcheck source=/dev/null
. "$NVM_DIR/nvm.sh"

TARGET_VERSION="${1:-24}"
nvm install "${TARGET_VERSION}"
nvm alias default "${TARGET_VERSION}"
nvm use default

NODE_BIN="$(command -v node)"
NPM_BIN="$(command -v npm)"

if [ -w /usr/local/bin ]; then
  ln -sf "${NODE_BIN}" /usr/local/bin/node
  ln -sf "${NPM_BIN}" /usr/local/bin/npm
elif command -v sudo >/dev/null 2>&1; then
  sudo ln -sf "${NODE_BIN}" /usr/local/bin/node
  sudo ln -sf "${NPM_BIN}" /usr/local/bin/npm
fi

echo "Default Node pinned to $(node -v)"
echo "  node: ${NODE_BIN}"
echo "  npm:  ${NPM_BIN}"
