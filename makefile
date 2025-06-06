# ───────────────────────────────────────────────────────────────────────────────
# HEAD: Detect available package manager
PKG_MGR := $(shell \
	if command -v bun >/dev/null 2>&1; then echo bun; \
	elif command -v pnpm >/dev/null 2>&1; then echo pnpm; \
	elif command -v yarn >/dev/null 2>&1; then echo yarn; \
	else echo "npm run"; \
	fi \
)
# ───────────────────────────────────────────────────────────────────────────────
# BODY: Development commands
.PHONY: run dev build install

BACKEND_DIR := backend
ROOT_DIR := .

run:
	cd $(BACKEND_DIR) && node local-server.js

dev:
	@echo "Using package manager: $(PKG_MGR)"
	cd $(ROOT_DIR) && $(PKG_MGR) dev

build:
	@echo "Using package manager: $(PKG_MGR)"
	cd $(ROOT_DIR) && $(PKG_MGR) build

install:
	npm install
