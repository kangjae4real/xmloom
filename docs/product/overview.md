# Product Overview

현재 제품 요구사항의 기준 문서는 [Product Requirements Document](./prd.md)다. 이 문서는 제품 의도를 빠르게 파악하기 위한 요약이다.

## Goal

XMLoom은 대충 작성된 자연어 입력을 XML 형식으로 빠르게 정리해주는 웹서비스입니다. 사용자는 XML 문법을 직접 외우거나 손으로 태그를 닫지 않아도, 여러 입력 필드의 내용을 구조화된 XML로 변환할 수 있어야 합니다.

초기 MVP는 규칙 기반 변환입니다. LLM은 사용하지 않으며, 같은 입력은 항상 같은 출력이 나와야 합니다.

## Target Users

- XML을 자주 다루지만 매번 직접 작성하기 번거로운 개발자와 기획자
- 여러 텍스트 조각을 XML 문서 초안으로 빠르게 정리하려는 사용자
- AI 자동화 이전에 예측 가능한 변환 도구가 필요한 사용자

## MVP Flow

1. 사용자가 하나 이상의 입력 블록을 만든다.
2. 필요한 경우 입력 블록 아래에 child 입력 블록을 만든다.
3. 각 입력 블록에 field name과 text content를 작성한다.
4. XMLoom이 입력 블록을 XML로 변환한다.
5. 사용자는 결과를 preview에서 확인한다.
6. 사용자는 XML을 복사하거나 입력을 초기화한다.
7. 사용자는 EN/KO toggle로 UI 언어를 전환할 수 있다.

## Rules-Based Conversion

- 변환 결과는 root wrapper 없이 복수 XML tag 목록으로 출력한다.
- top-level 입력 블록은 같은 depth의 sibling element가 된다.
- child 입력 블록은 parent tag 안의 nested element가 된다.
- parent content와 child element가 모두 있으면 parent content가 먼저 출력된다.
- field name이 안전한 XML tag name이면 element name으로 사용한다.
- field name이 비어 있거나 안전하지 않으면 `field-1`, `field-2`처럼 순서 기반 이름을 사용한다.
- 원본 field name이 tag name으로 쓰이지 못해도 MVP에서는 attribute로 보존하지 않는다.
- text content는 XML text node로 넣고, XML을 깨뜨릴 수 있는 문자는 안전하게 escape한다.
- 빈 입력 블록은 변환에서 제외하되, 모든 입력이 비어 있으면 empty state를 보여준다.

안전한 XML tag name의 최소 기준은 `A-Z`, `a-z`, `_`로 시작하고 이후에 `A-Z`, `a-z`, `0-9`, `_`, `-`를 허용하는 이름이다. 더 넓은 XML Name 규격 지원은 MVP 이후로 미룬다.

상세 변환 규칙은 [XML Conversion Spec](../specs/xml-conversion.md)을 따른다.

## Success Criteria

- 사용자가 XML 지식 없이도 1분 안에 XML 결과를 만들 수 있다.
- 복수 입력 필드가 순서대로 XML에 반영된다.
- child 입력 필드가 parent tag 안에 중첩되어 반영된다.
- 같은 입력과 같은 field name은 항상 같은 XML을 만든다.
- 결과 XML을 한 번의 명확한 액션으로 복사할 수 있다.
- 복사 성공/실패는 toast로 확인할 수 있다.
- invalid/empty state가 사용자를 막지 않고 다음 행동을 안내한다.
- 사용자는 영어와 한국어 UI를 전환할 수 있다.

## Non-Goals

- MVP에서 OpenAI API나 다른 LLM을 호출하지 않는다.
- MVP에서 XSD validation, XML namespace, XPath 편집, 파일 업로드는 다루지 않는다.
- MVP에서 사용자 계정, 저장소, 협업 기능은 만들지 않는다.
