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
.PHONY: run dev

BACKEND_DIR := ~/gh/cr8/backend
ROOT_DIR := ~/gh/cr8
run:
	cd $(BACKEND_DIR) && node local-server.js

dev:
	@echo "Using package manager: $(PKG_MGR)"
	cd $(ROOT_DIR) && $(PKG_MGR) dev

install:
	npm install