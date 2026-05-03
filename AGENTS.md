<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# XMLoom Agent Guide

Before changing this project, read:

1. `README.md`
2. `docs/README.md` for the full documentation map
3. `docs/product/prd.md` for product requirements and MVP scope
4. `docs/specs/xml-conversion.md` for XML conversion assumptions
5. `docs/specs/screen.md` for responsive UI and spacing rules
6. `docs/development/engineering.md` for code management, commits, lint, format, and implementation conventions
7. `docs/agents/guide.md` when you need the full re-entry checklist
8. `docs/planning/roadmap.md` for implementation priority

Project defaults:

- MVP conversion is rules-based, not OpenAI/LLM-backed.
- Package manager is `pnpm`.
- Commit messages follow Conventional Commits.
- PRD changes must update `docs/changelog/prd.md`.
- Spec changes must update `docs/changelog/specs.md`.
- Do not revert user changes unless explicitly requested.
- If docs and code disagree, inspect the actual code/config first and update docs when behavior intentionally changes.
