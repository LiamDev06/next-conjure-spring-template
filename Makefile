.PHONY: init gen dev stop db server frontend

init:
	@./scripts/init.sh $(filter-out $@,$(MAKECMDGOALS))

gen:
	@./scripts/generate-api-client.sh

dev:
	@./scripts/dev.sh

stop:
	@lsof -ti :8080 2>/dev/null | xargs kill 2>/dev/null || true
	@lsof -ti :3000 2>/dev/null | xargs kill 2>/dev/null || true
	@docker compose stop postgres

db:
	@docker compose up -d postgres

server:
	@./gradlew :template-server:bootRun

frontend:
	@cd template-app && npm run dev

%:
	@:
