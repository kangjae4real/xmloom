# XMLoom Docs

이 디렉터리는 XMLoom의 제품 의도, 화면/기능 스펙, 개발 규칙, Agent 재진입 가이드를 모아둔 문서 허브입니다. Codex, Claude, 다른 AI Agent, 사람 개발자 모두 이 파일을 시작점으로 사용합니다.

## Read First

1. [Product PRD](./product/prd.md)
2. [XML Conversion Spec](./specs/xml-conversion.md)
3. [Screen Spec](./specs/screen.md)
4. [Engineering Guide](./development/engineering.md)
5. [Agent Guide](./agents/guide.md)
6. [Repository Brief](./agents/repository-brief.md)
7. [Agent Skills](./agents/skills.md)

## Directory Map

- `product/`: 제품 목표, PRD, 사용자 문제, MVP 범위
- `specs/`: 화면, XML 변환, 입력/출력 동작 같은 구현 스펙
- `development/`: 코드 관리, 검증 명령어, 구현 규칙
- `agents/`: AI Agent가 작업을 이어가기 위한 재진입 문서, repository brief, local skill 사용법
- `planning/`: 로드맵과 단계별 개발 우선순위
- `changelog/`: PRD와 스펙 변경 이력

## Source Of Truth

- 제품 요구사항의 현재 기준은 [Product PRD](./product/prd.md)다.
- XML 변환 동작의 현재 기준은 [XML Conversion Spec](./specs/xml-conversion.md)다.
- 반응형 화면 기준은 [Screen Spec](./specs/screen.md)다.
- 변경 이유와 과거 결정은 [PRD Changelog](./changelog/prd.md), [Spec Changelog](./changelog/specs.md)에 남긴다.
- 코드와 문서가 다르면 실제 코드와 설정 파일을 먼저 확인하고, 의도한 변경이라면 문서를 함께 갱신한다.

## Change Tracking Rule

PRD나 스펙을 바꿀 때는 같은 커밋에서 변경 이력도 갱신한다.

- PRD 변경: `docs/product/prd.md`와 `docs/changelog/prd.md`
- XML 변환 스펙 변경: `docs/specs/xml-conversion.md`와 `docs/changelog/specs.md`
- 화면 스펙 변경: `docs/specs/screen.md`와 `docs/changelog/specs.md`
- 개발 규칙 변경: `docs/development/engineering.md`
- Agent skill 사용 규칙 변경: `docs/agents/skills.md`

작은 문구 수정은 changelog가 필요 없지만, 제품 동작, 화면 구조, 변환 규칙, 검증 기준이 바뀌면 changelog를 남긴다.
