# Agent Guide

이 문서는 Codex, Claude, 다른 AI Agent가 XMLoom 작업에 다시 들어올 때 사용하는 공통 재진입 문서다.

## Read Order

작업을 시작할 때 다음 순서로 읽는다.

1. `AGENTS.md`
2. `README.md`
3. `docs/README.md`
4. 현재 작업과 관련된 `docs/**/*.md`
5. shadcn/ui 작업이면 `docs/agents/skills.md`를 읽고, 로컬 shadcn/ui skill이 설치되어 있으면 해당 skill 문서
6. 관련 source file과 config file
7. Next.js 관련 변경이면 `node_modules/next/dist/docs/`의 관련 문서

## Where To Look

- 문서 허브: `docs/README.md`
- 제품 목표와 MVP 범위: `docs/product/prd.md`, `docs/product/overview.md`
- XML 변환 규칙: `docs/specs/xml-conversion.md`
- 화면 크기, gap, 상태별 UI: `docs/specs/screen.md`
- PRD와 스펙 변경 이력: `docs/changelog/prd.md`, `docs/changelog/specs.md`
- Agent-local skill 사용법: `docs/agents/skills.md`
- 커밋, lint, formatting, 코드 스타일: `docs/development/engineering.md`
- 단계별 개발 우선순위: `docs/planning/roadmap.md`
- locale message: `locales/en.json`, `locales/ko.json`
- 실제 package와 script: `package.json`
- shadcn 설정: `components.json`
- optional local shadcn skill: `.agents/skills/shadcn/SKILL.md`
- optional Claude shadcn skill symlink: `.claude/skills/shadcn`
- global theme token: `src/app/globals.css`

## Work Protocol

- 먼저 `git status --short`로 현재 변경 상태를 확인한다.
- 사용자가 만든 변경은 되돌리지 않는다.
- repo에 이미 있는 패턴과 helper를 우선 사용한다.
- shadcn component를 다루는 작업은 로컬 shadcn skill이 있으면 먼저 사용한다.
- 문서와 코드가 다르면 먼저 실제 코드와 설정 파일을 확인하고, 필요한 경우 문서 갱신도 같이 제안하거나 수행한다.
- 기능 구현 전후로 관련 문서가 오래되지 않았는지 확인한다.
- 큰 변경은 구현, 검증, 문서 반영이 한 세트가 되게 한다.

## If You Get Lost

1. `docs/README.md`의 문서 허브로 돌아간다.
2. 현재 작업이 제품, 화면, 코드 관리, 로드맵 중 어디에 속하는지 분류한다.
3. 해당 docs 파일을 다시 읽는다.
4. `rg`로 실제 source와 config에서 같은 개념을 검색한다.
5. Next.js API나 file convention이 관련되면 `node_modules/next/dist/docs/`를 읽는다.

## Change Tracking

- 제품 요구사항을 바꾸면 `docs/product/prd.md`와 `docs/changelog/prd.md`를 함께 갱신한다.
- XML 변환 규칙이나 화면 스펙을 바꾸면 해당 `docs/specs/` 문서와 `docs/changelog/specs.md`를 함께 갱신한다.
- changelog 없이 behavior를 바꾸지 않는다. 단순 오탈자나 링크 수정은 예외다.

## Reporting

작업 완료 보고에는 다음을 포함한다.

- 변경한 파일
- 동작 또는 문서 기준에서 달라진 점
- 실행한 검증 명령어
- 실행하지 못한 검증이 있다면 이유

코드 리뷰 요청을 받으면 요약보다 findings를 먼저 제시한다.
