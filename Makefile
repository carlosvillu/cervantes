.PHONY: lib
OWNER=Carlos Villuendas<carlosvillu@gmail.com>

SHELL := /bin/sh
.DEFAULT_GOAL := help

export DEBUG ?= cervantes:*
BUILD ?=

deploy:
	flyctl deploy --config $(PWD)/apps/$(APP)/fly.toml --build-target $(APP) --dockerfile ./.docker/Dockerfile

deploy_api:
	APP=api make deploy

deploy_editor:
	APP=editor make deploy

deploy_all:
	make -j $(nproc) deploy_api deploy_all

dev: ## develop the application
	docker compose -f ./.docker/compose.yaml up -d --remove-orphans
	npx ultra-runner --raw --recursive dev

build_dev: clean ## build and then start de env
		npx ultra-runner --recursive --build
		make dev

compose_dev: ## Start the env to develop using docker compose (BUILD=--build make compose_dev) to force a build
	docker-compose -f ./.docker/compose-dev.yaml -p cervantes up $(BUILD)

clean: ## Remove all artefactories
	rm -Rf apps/**/{public,dist,build,node_modules,package-lock.json} \
					packages/**/{dist,node_modules,.tshy-build}

phoenix: clean ## Soft clean node_modules
	rm -Rf node_modules package-lock.json &&\
		npm i --no-fund --no-audit

help: ## show help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


