# Product Requirements Document

문서 버전: `PRD-2026-05-03-004`  
상태: Draft  
마지막 갱신일: 2026-05-03

## Summary

XMLoom은 사용자가 자연어로 대충 작성한 여러 텍스트 입력을 예측 가능한 XML 문서로 변환하는 웹서비스다. 초기 제품은 규칙 기반 변환 도구이며, OpenAI API나 LLM 호출은 MVP 범위에 포함하지 않는다. v1은 sibling tag 목록과 tag 안의 child tag를 모두 지원한다.

## Problem

XML은 간단한 구조라도 태그 이름, 닫는 태그, escaping, 반복 element 작성이 번거롭다. 특히 여러 텍스트 조각을 빠르게 XML 초안으로 만들 때 사용자는 문법보다 내용 정리에 집중하고 싶다.

XMLoom은 입력 field와 text content를 받아 안전한 XML preview를 만들어 이 반복 작업을 줄인다.

## Goals

- 복수의 자연어 입력을 순서가 보존된 XML로 변환한다.
- parent-child 관계가 있는 입력을 중첩 XML tag로 변환한다.
- XML 문법을 몰라도 field name과 content만으로 결과를 만들 수 있게 한다.
- 같은 입력은 항상 같은 XML을 만드는 deterministic 변환을 제공한다.
- invalid field name, empty input, XML escaping을 안전하게 처리한다.
- 첫 화면에서 바로 입력, preview, copy가 가능해야 한다.
- 사용자는 한국어와 영어 UI를 전환할 수 있다.

## Non-Goals

- MVP에서 OpenAI API, LLM, prompt engineering 기능을 제공하지 않는다.
- MVP에서 사용자 계정, 저장, 공유 링크, 협업 편집을 제공하지 않는다.
- MVP에서 XSD, DTD, namespace, XPath, XML formatter option 전체를 제공하지 않는다.
- MVP에서 파일 업로드나 외부 API import/export를 제공하지 않는다.

## Users

- 개발자: 임시 XML payload나 테스트 데이터를 빠르게 만들고 싶다.
- 기획자/운영자: 구조화된 XML 초안을 개발자에게 전달하고 싶다.
- AI Agent 사용자: 자연어 요구사항을 중간 XML 형식으로 정리하고 싶다.

## Core User Stories

- 사용자는 field를 추가하고 이름과 내용을 입력할 수 있다.
- 사용자는 field 아래에 child field를 추가해 tag in tag 구조를 만들 수 있다.
- 사용자는 입력한 순서대로 XML preview가 만들어지는 것을 확인할 수 있다.
- 사용자는 안전하지 않은 field name을 입력해도 변환이 막히지 않고 fallback tag로 결과를 얻을 수 있다.
- 사용자는 XML 결과를 복사할 수 있다.
- 사용자는 모든 입력을 초기화하고 다시 시작할 수 있다.
- 사용자는 UI 언어를 영어 또는 한국어로 바꿀 수 있다.

## Functional Requirements

- `FR-001`: 사용자는 하나 이상의 입력 block을 만들 수 있다.
- `FR-002`: 각 입력 block은 field name과 text content를 가진다.
- `FR-003`: 변환 결과는 입력 block 순서대로 XML element 목록을 만든다.
- `FR-004`: field name이 안전한 XML tag name이면 child element name으로 사용한다.
- `FR-005`: field name이 비어 있거나 안전하지 않으면 안정적인 순서 기반 fallback tag name을 사용한다.
- `FR-006`: XML text content는 안전하게 escape한다.
- `FR-007`: 비어 있는 입력 block은 변환 결과에서 제외한다.
- `FR-008`: 변환 가능한 입력이 없으면 XML 대신 empty state를 보여준다.
- `FR-009`: 사용자는 XML 결과를 clipboard로 복사할 수 있다.
- `FR-010`: 사용자는 입력 전체를 초기화할 수 있다.
- `FR-011`: 각 입력 block은 ordered child block 목록을 가질 수 있다.
- `FR-012`: content가 비어 있어도 변환 가능한 child block이 있으면 parent tag를 출력한다.
- `FR-013`: child block은 parent tag 안에 parent content 다음 순서로 출력한다.
- `FR-014`: UI 문구는 `locales/en.json`, `locales/ko.json`의 translation key를 기준으로 제공한다.
- `FR-015`: 사용자는 화면에서 언어를 영어 또는 한국어로 전환할 수 있다.

## UX Requirements

- 첫 화면은 제품 설명용 landing page가 아니라 변환 작업 화면이다.
- mobile에서는 입력과 preview를 세로로 배치한다.
- desktop에서는 입력과 preview를 나란히 배치한다.
- child field는 parent field 아래에 시각적으로 들여쓰기해 표시한다.
- copy success/failure 상태는 shadcn/ui `sonner` toast로 명확히 표시한다.
- keyboard만으로 field 추가, 삭제, copy, reset이 가능해야 한다.

## Data And Privacy

- MVP는 server persistence를 전제하지 않는다.
- 입력 내용은 사용자의 브라우저 세션 안에서만 다룬다.
- AI/LLM 호출이 없으므로 입력을 외부 모델 provider로 전송하지 않는다.

## Acceptance Criteria

- 사용자가 field 2개를 입력하면 sibling XML element 2개가 순서대로 생성된다.
- 사용자가 parent field 아래 child field를 추가하면 child XML element가 parent tag 안에 생성된다.
- parent와 child가 모두 content를 가지면 parent content가 먼저, child element가 다음 line에 출력된다.
- `title` 같은 안전한 field name은 `<title>`로 변환된다.
- `문서 제목`처럼 안전하지 않은 field name은 `field-1` 같은 fallback tag로 변환된다.
- content에 `<`, `>`, `&`가 포함되어도 XML이 깨지지 않는다.
- 모든 field가 비어 있으면 empty state가 표시된다.
- 사용자는 EN/KO toggle로 UI 언어를 전환할 수 있다.
- XML 복사 성공과 실패는 preview card 하단 inline message가 아니라 toast로 표시된다.

## V1 Decisions

- root wrapper는 v1에서 출력하지 않는다.
- preview는 별도 convert action 없이 입력 변경에 따라 즉시 갱신한다.
- fallback tag에는 원본 field name을 attribute로 보존하지 않는다.
- nested tag는 v1에서 기본 지원한다.
- 언어 선택은 route 변경 없이 client-side toggle과 local storage로 처리한다.

## Open Questions

- root wrapper option을 v2에서 열지 여부
- locale별 URL을 v2 이후 제공할지 여부
