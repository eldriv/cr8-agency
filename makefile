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
.PHONY: dev

dev:
	@echo "Using package manager: $(PKG_MGR)"
	$(PKG_MGR) dev
