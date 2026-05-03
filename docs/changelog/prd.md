# PRD Changelog

제품 요구사항 변경 이력을 기록한다. `docs/product/prd.md`의 목표, MVP 범위, non-goal, 사용자 흐름, acceptance criteria가 바뀌면 이 문서를 함께 갱신한다.

## Entry Format

```text
## YYYY-MM-DD - PRD-VERSION

Status:
Summary:
Changed:
Reason:
Impact:
Related Docs:
```

## 2026-05-03 - PRD-2026-05-03-001

Status: Draft baseline

Summary: XMLoom의 초기 PRD를 작성했다.

Changed:

- MVP를 규칙 기반 XML 변환 도구로 정의했다.
- OpenAI API와 LLM 연동을 MVP non-goal로 명시했다.
- 복수 field 입력, XML preview, copy, reset을 core user story로 정의했다.
- deterministic conversion, tag fallback, XML escaping을 acceptance criteria에 포함했다.

Reason:

- 초기 제품 범위를 작고 예측 가능하게 유지하기 위해 AI 기능보다 규칙 기반 변환을 먼저 정의했다.
- Codex, Claude, 사람 개발자가 같은 제품 기준을 읽고 구현 결정을 내릴 수 있게 하기 위해 PRD를 분리했다.

Impact:

- v1 구현은 `docs/specs/xml-conversion.md`의 deterministic spec을 따라야 한다.
- AI 보조 변환은 `docs/planning/roadmap.md`의 v3 후보로 유지된다.

Related Docs:

- `docs/product/prd.md`
- `docs/product/overview.md`
- `docs/specs/xml-conversion.md`
- `docs/planning/roadmap.md`
