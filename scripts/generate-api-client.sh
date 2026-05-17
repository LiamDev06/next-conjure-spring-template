#!/usr/bin/env bash
set -euo pipefail

./gradlew :template-api:clean :template-api:compileConjure

find template-api/template-api-typescript/src -name '*.js'   -not -path '*/node_modules/*' -delete
find template-api/template-api-typescript/src -name '*.d.ts' -not -path '*/node_modules/*' -delete

pnpm install
pnpm --filter @template/template-api exec tsc
