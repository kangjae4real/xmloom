# Agent Skills

이 문서는 XMLoom에서 Codex, Claude, 기타 Agent가 사용할 수 있는 project-local skill을 기록한다.

## shadcn/ui

XMLoom은 shadcn/ui 작업을 위해 local skill을 설치해두면 더 효율적으로 작업할 수 있다. `.agents/`, `.claude/`는 개인 agent 환경 설정이므로 git에서 추적하지 않는다.

- 권장 Codex skill path: `.agents/skills/shadcn/SKILL.md`
- 권장 Claude skill path: `.claude/skills/shadcn`
- Claude path는 필요하면 `.agents/skills/shadcn`을 가리키는 symlink로 둔다.

shadcn component를 추가, 수정, 디버깅, 스타일링, 조합할 때는 로컬 skill이 있으면 먼저 사용한다. Agent 환경에서 skill이 자동으로 로드되지 않으면 설치된 `SKILL.md`를 직접 읽고 그 지침을 따른다.

## Required Workflow For shadcn Work

1. 로컬 shadcn/ui skill이 설치되어 있으면 해당 `SKILL.md`를 읽는다.
2. `components.json`에서 현재 shadcn 설정을 확인한다.
3. 필요하면 `pnpm dlx shadcn@latest info`로 project context를 갱신한다.
4. 새 component가 필요하면 registry를 검색하거나 docs를 확인한 뒤 추가한다.
5. 기존 component를 덮어쓰기 전에 `--dry-run` 또는 `--diff`로 변경을 확인한다.
6. 추가된 source file을 직접 읽고 import path, composition, accessibility, icon usage를 확인한다.
7. `pnpm lint`와 `pnpm exec prettier . --check`를 실행한다.

## XMLoom shadcn Defaults

현재 `components.json` 기준:

- style: `radix-luma`
- base color: `mist`
- icon library: `lucide`
- components alias: `@/components`
- ui alias: `@/components/shadcn`
- utils alias: `@/utils/shadcn`
- Tailwind CSS file: `src/app/globals.css`
- RSC mode: enabled

코드에서는 실제 alias를 우선한다. 예를 들어 shadcn UI component import는 `@/components/shadcn/...` 경로를 사용한다.

## Practical Rules

- 이미 설치된 shadcn component가 있으면 먼저 재사용한다.
- 새 component는 수동으로 registry source를 복사하지 않고 shadcn CLI를 사용한다.
- 이 프로젝트는 `pnpm`을 사용하므로 CLI 예시는 `pnpm dlx shadcn@latest ...` 형태를 우선한다.
- shadcn component 내부의 색상, typography를 raw Tailwind color로 덮어쓰지 말고 semantic token을 사용한다.
- layout spacing은 `space-*`보다 `gap-*`을 우선한다.
- lucide icon을 Button 안에 넣을 때는 shadcn skill의 icon rule을 따른다.
- Dialog, Sheet, Drawer 같은 overlay component는 접근성 title 요구사항을 확인한다.
- component를 추가하거나 기존 shadcn component를 업데이트하면 이 문서와 [Engineering Guide](../development/engineering.md)의 UI 규칙이 여전히 맞는지 확인한다.
