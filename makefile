.PHONY: run dev build install

BACKEND_DIR := backend
ROOT_DIR := .

run:
	cd $(BACKEND_DIR) && node local-server.js

dev:
	npm run dev

build:
	npm run build

install:
	npm install
