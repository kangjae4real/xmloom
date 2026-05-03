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

## 2026-05-03 - PRD-2026-05-03-002

Status: V1 implementation decision

Summary: v1 MVP 구현 중 남아 있던 open question 일부를 제품 결정으로 확정했다.

Changed:

- root element name은 v1에서 `xmloom`으로 고정한다.
- XML preview는 별도 convert action 없이 입력 변경에 따라 즉시 갱신한다.
- fallback tag에는 원본 field name을 attribute로 보존하지 않는다.

Reason:

- v1 MVP를 deterministic하고 단순한 클라이언트 도구로 유지하기 위해 설정 surface를 줄였다.

Impact:

- v1 UI에는 root name editor나 convert button을 추가하지 않는다.
- fallback tag 원본 label 보존은 v2 이후 필요가 생길 때 다시 검토한다.

Related Docs:

- `docs/product/prd.md`
- `docs/specs/screen.md`
- `docs/specs/xml-conversion.md`

## 2026-05-03 - PRD-2026-05-03-003

Status: V1 implementation correction

Summary: XML 출력에서 `xmloom` root wrapper를 제거하기로 확정했다.

Changed:

- 변환 결과는 root element 아래 child 목록이 아니라 sibling XML element 목록으로 출력한다.
- v1 UI의 root name 개념을 제거한다.
- root wrapper는 v2 이후 optional feature 후보로만 남긴다.

Reason:

- 사용자는 복수 text field가 각각 XML tag로 변환되기를 기대하며, 기본 wrapper는 불필요한 출력 제약이다.

Impact:

- v1 preview와 copy 결과에는 `<xmloom>...</xmloom>`이 포함되지 않는다.
- XML 변환 함수는 rootName 입력을 받지 않는다.

Related Docs:

- `docs/product/prd.md`
- `docs/product/overview.md`
- `docs/specs/xml-conversion.md`
