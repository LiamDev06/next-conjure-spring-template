#!/usr/bin/env bash
set -euo pipefail

./gradlew :template-api:clean :template-api:compileConjure

find template-api/template-api-typescript/src -name '*.js'   -not -path '*/node_modules/*' -delete
find template-api/template-api-typescript/src -name '*.d.ts' -not -path '*/node_modules/*' -delete

(cd template-api/template-api-typescript/src && npm install && npx tsc)

rm -rf template-app/node_modules/@template/template-api
(cd template-app && npm install --install-links)
