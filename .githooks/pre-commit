#!/usr/bin/env bash
set -uo pipefail

FAILED=false
FRONTEND_CHANGED=false
BACKEND_CHANGED=false

while IFS= read -r file; do
  case "$file" in
    template-app/*)    FRONTEND_CHANGED=true ;;
    template-server/*) BACKEND_CHANGED=true ;;
  esac
done < <(git diff --cached --name-only --diff-filter=ACM)

if [ "$FRONTEND_CHANGED" = false ] && [ "$BACKEND_CHANGED" = false ]; then
  exit 0
fi

if [ "$FRONTEND_CHANGED" = true ]; then
  echo ""
  echo "==> Frontend changes detected"

  echo "    Running ESLint..."
  if ! (cd template-app && npm run lint); then
    FAILED=true
  fi

  echo "    Running Prettier check..."
  if ! (cd template-app && npm run format:check); then
    echo "    To fix: cd template-app && npm run format"
    FAILED=true
  fi
fi

if [ "$BACKEND_CHANGED" = true ]; then
  echo ""
  echo "==> Backend changes detected"
  echo "    Running Spotless check, Checkstyle, and PMD..."
  if ! ./gradlew :template-server:lint; then
    echo "    To fix formatting: ./gradlew :template-server:spotlessApply"
    FAILED=true
  fi
fi

echo ""
if [ "$FAILED" = true ]; then
  echo "Pre-commit checks failed. Fix the issues above and try again."
  exit 1
fi
