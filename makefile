# ───────────────────────────────────────────────────────────────────────────────
# HEAD: Detect available package manager
PKG_MGR := $(shell \
	command -v bun >/dev/null 2>&1 && echo "bun" || \
	command -v pnpm >/dev/null 2>&1 && echo "pnpm" || \
	command -v yarn >/dev/null 2>&1 && echo "yarn" || \
	echo "npm run" \
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
