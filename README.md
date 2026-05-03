# XMLoom

대충 적은 텍스트를 읽기 쉬운 XML 태그로 바꿔주는 간단한 웹서비스입니다.

XML 문법을 직접 맞추거나 닫는 태그를 손으로 챙기지 않아도, 필드 이름과 내용을 입력하면 XMLoom이 바로 XML 미리보기를 만들어 줍니다.

## What You Can Do

- 여러 개의 텍스트 필드를 XML 태그 목록으로 변환합니다.
- 필드 안에 하위 필드를 추가해 nested XML을 만들 수 있습니다.
- 입력을 바꾸면 XML 미리보기가 즉시 갱신됩니다.
- 결과 XML을 한 번에 복사할 수 있습니다.
- 영어와 한국어 UI를 전환할 수 있습니다.
- 입력 내용은 브라우저 안에서만 처리됩니다.

## How To Use

1. `Field name`에 XML 태그 이름을 적습니다.
2. `Content`에 태그 안에 들어갈 텍스트를 적습니다.
3. 태그 안에 또 다른 태그가 필요하면 `Add child`를 누릅니다.
4. 오른쪽 XML preview에서 결과를 확인합니다.
5. `Copy XML`을 눌러 결과를 복사합니다.

예시 입력:

```text
Field name: context
Content:
asdad
asd
asd
```

결과:

```xml
<context>
  asdad
  asd
  asd
</context>
```

Nested XML 예시:

```xml
<document>
  대충 적은 문서 설명
  <section>첫 번째 섹션</section>
</document>
```

## Tag Name Rules

안전한 태그 이름은 영문자 또는 `_`로 시작하고, 이후에는 영문자, 숫자, `_`, `-`를 사용할 수 있습니다.

안전하지 않은 이름을 입력해도 변환은 멈추지 않습니다. XMLoom은 `field-1`, `field-2`처럼 안전한 fallback tag name을 자동으로 사용합니다.

## Run Locally

```bash
pnpm install
pnpm dev
```

Next.js가 안내하는 로컬 주소를 브라우저에서 열면 XMLoom을 사용할 수 있습니다.

## For Maintainers And Agents

개발 규칙, 문서 구조, 기술 스택, Agent 재진입 정보는 [Repository Brief](./docs/agents/repository-brief.md)에서 시작하세요.
