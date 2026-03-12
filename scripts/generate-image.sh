#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[deprecated] scripts/generate-image.sh now forwards to scripts/generate-image.mjs" >&2
exec node "${SCRIPT_DIR}/generate-image.mjs" "$@"
