# Portfolio — Vishnu Vardhan Kosuru

.PHONY: qa uat prod build-qa build-uat build-prod clean

## Dev servers
qa:
	@ENV=qa node scripts/serve.js

uat:
	@ENV=uat node scripts/serve.js

prod:
	@ENV=production node scripts/serve.js

## Builds
build-qa:
	@ENV=qa node scripts/build.js

build-uat:
	@ENV=uat node scripts/build.js

build-prod:
	@ENV=production node scripts/build.js

## Clean dist
clean:
	@rm -rf dist
	@echo "🧹 Cleaned dist/"

help:
	@echo ""
	@echo "  make qa          → Start dev server (QA)"
	@echo "  make uat         → Start dev server (UAT)"
	@echo "  make prod        → Start prod server"
	@echo "  make build-qa    → Build for QA  → dist/qa/"
	@echo "  make build-uat   → Build for UAT → dist/uat/"
	@echo "  make build-prod  → Build for Prod → dist/production/"
	@echo "  make clean       → Remove dist/"
	@echo ""
