.PHONY: init gen-api-client dev

init:
	@./scripts/init.sh $(filter-out $@,$(MAKECMDGOALS))

gen-api-client:
	@./scripts/generate-api-client.sh

dev:
	@./scripts/dev.sh

%:
	@:
