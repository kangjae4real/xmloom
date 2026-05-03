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
