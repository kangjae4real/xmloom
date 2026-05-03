# XML Conversion Spec

스펙 버전: `SPEC-XML-2026-05-03-001`  
상태: Draft  
마지막 갱신일: 2026-05-03

## Scope

이 문서는 XMLoom MVP의 규칙 기반 XML 변환 동작을 정의한다. AI/LLM 기반 보정, XML schema validation, namespace 처리는 포함하지 않는다.

## Input Model

구현에서 사용하는 내부 shape는 달라질 수 있지만, MVP 변환기는 다음 개념을 입력으로 받는다.

- `fields`: ordered list
- 각 field:
  - `name`: optional string
  - `content`: optional string

입력 field의 순서는 결과 XML의 child element 순서와 동일해야 한다.

## Output Model

- 변환 가능한 field가 하나 이상 있으면 XML string을 반환한다.
- 변환 가능한 field가 없으면 XML string 대신 empty state를 표시한다.
- XML string은 root wrapper 없이 sibling element 목록으로 구성한다.

예시:

```xml
<title>Hello XMLoom</title>
<summary>Rules-based XML preview</summary>
```

## Field Inclusion

- `content.trim()`이 빈 문자열이면 해당 field는 결과에서 제외한다.
- `name`이 비어 있어도 `content`가 있으면 fallback tag name으로 포함한다.
- 모든 field가 제외되면 empty state로 처리한다.

## Tag Name Rule

MVP의 안전한 tag name은 다음 정규식으로 판정한다.

```text
^[A-Za-z_][A-Za-z0-9_-]*$
```

- 안전한 `name`은 그대로 element name으로 사용한다.
- 안전하지 않거나 비어 있는 `name`은 `field-1`, `field-2`처럼 field의 원래 순서를 기준으로 fallback한다.
- fallback 번호는 전체 field index 기준으로 안정적으로 계산한다.
- XML Name 전체 규격, unicode tag name, namespace prefix 지원은 MVP 이후로 미룬다.

## Wrapper Rule

- MVP는 root wrapper element를 출력하지 않는다.
- 모든 included field는 같은 depth의 sibling element로 출력한다.
- root wrapper option은 v2 이후 필요가 생길 때 별도 스펙으로 추가한다.

## Escaping Rule

Text node에서는 최소한 다음 문자를 escape한다.

| Character | Escaped |
| --------- | ------- |
| `&`       | `&amp;` |
| `<`       | `&lt;`  |
| `>`       | `&gt;`  |

Attribute를 도입하는 경우 다음 문자도 escape한다.

| Character | Escaped  |
| --------- | -------- |
| `"`       | `&quot;` |
| `'`       | `&apos;` |

Escaping은 중복 적용으로 기존 entity를 망가뜨리지 않도록 변환 함수에서 일관되게 처리한다.

## Formatting Rule

- XML declaration은 MVP에서 출력하지 않는다.
- indentation은 two spaces를 사용한다.
- content가 single-line이면 element도 한 줄에 출력한다.
- content에 newline이 포함되면 open tag, content, close tag를 별도 line으로 출력한다.
- multi-line content의 각 line은 two spaces로 indent한다.
- multi-line content 내부의 빈 line도 보존한다.

## Error And Empty States

- invalid field name은 hard error가 아니다. fallback tag를 사용한다.
- empty content는 hard error가 아니다. 결과에서 제외한다.
- clipboard 실패는 변환 실패가 아니다. preview는 그대로 유지한다.
- 변환 함수가 예외를 던져야 하는 상황은 MVP에서 만들지 않는다.

## Examples

입력:

```text
name: title
content: Hello & XML

name: 문서 제목
content: <draft>

name: context
content: line 1
line 2
```

출력:

```xml
<title>Hello &amp; XML</title>
<field-2>&lt;draft&gt;</field-2>
<context>
  line 1
  line 2
</context>
```
