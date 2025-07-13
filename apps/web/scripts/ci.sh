#!/usr/bin/env bash
set -euo pipefail

# Absolute path to project root (directory that contains this script)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# 1. Load .env safely
if [[ -f .env ]]; then
  set -a               # export all sourced variables
  # shellcheck disable=SC1091
  source ./.env
  set +a
fi

# 2. Honor CI_DISABLED
if [[ "${CI_DISABLED:-0}" == "1" ]]; then
  echo "CI_DISABLED is set to 1. Exiting."
  exit 0
fi

# Run CI pipeline
npm run data-wak-download
npm run scrape-data-wak
npm run generate-gifs
npm run generate-static-assets