#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/init.sh <project-name>
# Example: ./scripts/init.sh myproject
#          ./scripts/init.sh my-project

NAME="${1:-}"
if [ -z "$NAME" ]; then
  echo "Usage: make init yourproject"
  echo "  NAME should be lowercase, e.g. myproject or my-project"
  exit 1
fi

# Derive naming variants
NAME_PACKAGE=$(printf '%s' "$NAME" | tr -d '_-')
NAME_PASCAL=$(python3 -c "n='$NAME'; print(''.join(w.capitalize() for w in n.replace('-','_').split('_')))")

echo ""
echo "Initializing project: $NAME"
echo "  Java package : com.$NAME_PACKAGE"
echo "  Class prefix : $NAME_PASCAL"
echo ""

# ---------------------------------------------------------------------------
# Step 1: Replace file contents
# ---------------------------------------------------------------------------
echo "==> Replacing template references in files..."

# com.template -> com.<name> (Java packages, Conjure YAML, Gradle group)
find . -type f \( -name "*.java" -o -name "*.kts" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.sh" -o -name "Makefile" \) \
  -not -path "*/build/*" -not -path "*/node_modules/*" -not -path "*/.git/*" \
  -exec sed -i '' "s/com\.template/com.$NAME_PACKAGE/g" {} +

# Template -> <NamePascal> (Java class names only)
find . -type f -name "*.java" \
  -not -path "*/build/*" \
  -exec sed -i '' "s/Template/$NAME_PASCAL/g" {} +

# @template/ -> @<name>/  and  template- -> <name>- (module names, paths, npm scope, scripts)
find . -type f \( -name "*.kts" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.sh" -o -name "CLAUDE.md" -o -name "Makefile" \) \
  -not -path "*/build/*" -not -path "*/node_modules/*" -not -path "*/.git/*" \
  -exec sed -i '' "s|@template/|@$NAME/|g; s/template-/$NAME-/g" {} +

# rootProject.name = "template" (bare word, not caught by template- pattern)
sed -i '' "s/rootProject\.name = \"template\"/rootProject.name = \"$NAME\"/" settings.gradle.kts

# ---------------------------------------------------------------------------
# Step 2: Rename Java source directories
# ---------------------------------------------------------------------------
echo "==> Renaming Java source directories..."

for dir in \
  "template-server/src/main/java/com/template" \
  "template-server/src/test/java/com/template"
do
  if [ -d "$dir" ]; then
    mv "$dir" "$(dirname "$dir")/$NAME_PACKAGE"
  fi
done

# ---------------------------------------------------------------------------
# Step 3: Rename Java source files
# ---------------------------------------------------------------------------
echo "==> Renaming Java source files..."

for file in \
  "template-server/src/main/java/com/$NAME_PACKAGE/server/TemplateServer.java" \
  "template-server/src/test/java/com/$NAME_PACKAGE/server/TemplateServerTest.java"
do
  if [ -f "$file" ]; then
    mv "$file" "${file//Template/$NAME_PASCAL}"
  fi
done

# ---------------------------------------------------------------------------
# Step 4: Rename module directories (subdirs before parent)
# ---------------------------------------------------------------------------
echo "==> Renaming module directories..."

mv "template-api/template-api-jersey"     "template-api/$NAME-api-jersey"
mv "template-api/template-api-objects"    "template-api/$NAME-api-objects"
mv "template-api/template-api-typescript" "template-api/$NAME-api-typescript"
mv "template-api"    "$NAME-api"
mv "template-server" "$NAME-server"
mv "template-app"    "$NAME-app"

# ---------------------------------------------------------------------------
# Step 5: Copy environment files
# ---------------------------------------------------------------------------
echo "==> Copying environment files..."
cp "$NAME-server/src/main/resources/.env.example" "$NAME-server/src/main/resources/.env"
cp "$NAME-app/.env.example" "$NAME-app/.env.local"

# ---------------------------------------------------------------------------
# Step 6: Build server
# ---------------------------------------------------------------------------
echo "==> Building server..."
./gradlew ":$NAME-server:build"

# ---------------------------------------------------------------------------
# Step 7: Generate API client and install frontend dependencies
# ---------------------------------------------------------------------------
echo "==> Generating API client and installing frontend dependencies..."
./scripts/generate-api-client.sh

echo ""
echo "Project '$NAME' is ready!"
echo "Run 'make dev' to startup everything."
echo " "
echo "  Start postgres:   docker compose up -d postgres"
echo "  Start server:     ./gradlew :$NAME-server:bootRun"
echo "  Start frontend:   cd $NAME-app && npm run dev"
