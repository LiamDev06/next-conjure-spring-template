#!/usr/bin/env bash
set -euo pipefail

# Start postgres
docker compose up -d postgres

# Start the server in the background and kill it when this script exits
./gradlew :template-server:bootRun &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null; docker compose stop postgres" EXIT

# Run the frontend in the foreground — Ctrl+C here stops both
cd template-app && npm run dev
