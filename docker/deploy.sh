#!/usr/bin/env bash
# Cross-platform deploy wrapper (Linux/macOS). On Windows use: node scripts/docker-prod-up.mjs
set -euo pipefail
exec node "$(dirname "$0")/../scripts/docker-prod-up.mjs"
