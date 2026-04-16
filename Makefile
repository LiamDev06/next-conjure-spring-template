.PHONY: init gen dev stop db server frontend

init:
	@./scripts/init.sh $(filter-out $@,$(MAKECMDGOALS))

gen:
	@./scripts/generate-api-client.sh

dev:
	@./scripts/dev.sh

stop:
	@./scripts/stop.sh

db:
	@docker compose up -d postgres

server:
	@./gradlew :template-server:bootRun

frontend:
	@cd template-app && npm run dev

%:
	@:
