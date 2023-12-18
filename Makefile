.PHONY: lib
OWNER=Carlos Villuendas<carlosvillu@gmail.com>

SHELL := /bin/bash
.DEFAULT_GOAL := help

dev: clean ## develop the application
		npx -y ultra-runner --raw --recursive dev

prepare: clean ## develop the application
		npx -y ultra-runner --raw --recursive prepare

clean: ## Remove all artefactories
	@rm -Rf apps/editor/{public,dist} \
					packages/domain/dist

help: ## show help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


