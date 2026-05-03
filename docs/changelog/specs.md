# Spec Changelog

화면, XML 변환, 개발 규칙처럼 구현에 직접 영향을 주는 스펙 변경 이력을 기록한다.

## Entry Format

```text
## YYYY-MM-DD - SPEC-ID

Status:
Area:
Summary:
Changed:
Reason:
Impact:
Related Docs:
```

## 2026-05-03 - SPEC-XML-2026-05-03-001

Status: Draft baseline

Area: XML conversion

Summary: 규칙 기반 XML 변환 스펙을 신설했다.

Changed:

- 기본 root element를 `xmloom`으로 정의했다.
- field inclusion rule, tag name rule, fallback tag rule을 정의했다.
- text node와 attribute escaping 기준을 분리했다.
- XML declaration을 MVP에서 출력하지 않기로 했다.

Reason:

- 구현자가 UI와 변환 로직을 분리하고, 같은 입력에 같은 출력을 보장할 수 있게 하기 위해 세부 규칙을 명문화했다.

Impact:

- 변환 로직은 pure function으로 작성해야 한다.
- field name validation은 hard error가 아니라 fallback behavior로 처리해야 한다.

Related Docs:

- `docs/specs/xml-conversion.md`
- `docs/product/prd.md`
- `docs/development/engineering.md`

## 2026-05-03 - SPEC-SCREEN-2026-05-03-001

Status: Draft baseline

Area: Responsive screen

Summary: mobile/tablet/desktop 화면 기준을 정리했다.

Changed:

- mobile `<768px`, tablet `768px-1023px`, desktop `>=1024px` 기준을 정의했다.
- 4px 기반 spacing, page padding, 주요 영역 gap을 정의했다.
- 첫 화면을 landing page가 아닌 XML 변환 작업 화면으로 정의했다.
- empty, editing, invalid field name, copy success/failure 상태를 필수 UI state로 정의했다.

Reason:

- 초기 구현부터 반응형 레이아웃과 상태별 UI가 흔들리지 않게 하기 위해 화면 스펙을 분리했다.

Impact:

- v1 UI는 `docs/specs/screen.md`의 layout과 required state를 따라야 한다.
- 화면 구조가 바뀌면 이 changelog에 변경 이유를 남겨야 한다.

Related Docs:

- `docs/specs/screen.md`
- `docs/product/prd.md`

## 2026-05-03 - SPEC-XML-2026-05-03-002

Status: V1 implementation correction

Area: XML conversion

Summary: XML 변환 출력에서 root wrapper를 제거했다.

Changed:

- 변환 결과는 root wrapper 없이 sibling XML element 목록으로 구성한다.
- `rootName` 입력 모델과 root name fallback rule을 제거한다.
- formatting rule은 각 element를 한 줄로 출력하는 기준으로 단순화한다.

Reason:

- XMLoom의 MVP 요구사항은 여러 입력을 여러 XML tag로 변환하는 것이며, wrapper element는 필수 요구사항이 아니다.

Impact:

- `buildXmlDocument`는 `<xmloom>` open/close tag를 만들지 않는다.
- preview, copy, empty state는 기존처럼 동작하되 출력 XML shape만 바뀐다.

Related Docs:

- `docs/specs/xml-conversion.md`
- `docs/product/prd.md`

## 2026-05-03 - SPEC-XML-2026-05-03-003

Status: V1 implementation correction

Area: XML conversion

Summary: multi-line content의 XML 출력 가독성을 개선했다.

Changed:

- single-line content는 기존처럼 `<tag>content</tag>` 한 줄로 출력한다.
- newline이 포함된 content는 open tag, indented content lines, close tag로 나누어 출력한다.
- multi-line content의 각 line은 two spaces로 indent한다.

Reason:

- 긴 자연어 입력이나 줄바꿈이 있는 context를 한 줄 element에 넣으면 preview 가독성이 떨어진다.

Impact:

- copy 결과가 multi-line 입력에 대해 더 읽기 쉬운 XML block 형태가 된다.
- XML escaping 규칙과 field inclusion rule은 그대로 유지된다.

Related Docs:

- `docs/specs/xml-conversion.md`

## 2026-05-03 - SPEC-SCREEN-2026-05-03-002

Status: V1 implementation decision

Area: Responsive screen

Summary: preview 갱신 방식을 즉시 갱신으로 확정했다.

Changed:

- editing state에서 XML preview는 입력 변경에 따라 즉시 갱신된다.
- 별도 convert action은 v1 화면에 두지 않는다.

Reason:

- 규칙 기반 변환은 비용이 낮고 deterministic하므로 사용자가 입력과 결과를 바로 비교하는 편이 더 단순하다.

Impact:

- copy action은 현재 preview를 복사한다.
- empty state는 content가 모두 비어 있을 때 즉시 복귀한다.

Related Docs:

- `docs/specs/screen.md`
- `docs/product/prd.md`

## 2026-05-03 - SPEC-XML-2026-05-03-004

Status: V1 improvement

Area: XML conversion

Summary: XML 변환 입력 모델에 child field tree를 추가했다.

Changed:

- field input은 optional ordered `children` list를 가질 수 있다.
- content가 비어 있어도 included child가 있으면 parent element를 출력한다.
- child element는 parent element 안에 two-space indentation으로 출력한다.
- parent content와 child element가 함께 있으면 parent content가 먼저 출력된다.
- fallback tag 번호는 각 sibling list 기준으로 계산한다.

Reason:

- 사용자가 XML tag 안의 하위 tag 구조를 직접 구성할 수 있어야 한다.
- nested XML 출력도 기존 deterministic 변환 규칙과 같은 방식으로 예측 가능해야 한다.

Impact:

- `buildXmlDocument`는 recursive field list를 받아야 한다.
- formatter는 child element가 있는 경우 single-line element 대신 block format을 사용해야 한다.

Related Docs:

- `docs/specs/xml-conversion.md`
- `docs/product/prd.md`
- `docs/development/engineering.md`

## 2026-05-03 - SPEC-SCREEN-2026-05-03-003

Status: V1 improvement

Area: Responsive screen

Summary: nested field editing, language toggle, and sonner feedback 화면 규칙을 추가했다.

Changed:

- parent field 아래 child field를 추가, 편집, 삭제하는 UI state를 정의했다.
- child field는 parent 아래에서 border-left와 padding으로 계층을 보여준다.
- header 우측에 EN/KO language toggle을 둔다.
- copy success/failure는 shadcn/ui `sonner` toast로 표시한다.

Reason:

- nested XML 기능은 입력 화면에서도 계층이 명확해야 한다.
- 언어 전환은 별도 route 변경 없이 즉시 확인 가능한 control이어야 한다.
- copy feedback은 preview와 입력 흐름을 방해하지 않는 일시적 feedback이어야 한다.

Impact:

- UI 구현은 shadcn/ui `ToggleGroup`과 `sonner`를 포함해야 한다.
- 문구 추가/변경 시 locale JSON을 함께 갱신해야 한다.

Related Docs:

- `docs/specs/screen.md`
- `docs/product/prd.md`
- `docs/development/engineering.md`
