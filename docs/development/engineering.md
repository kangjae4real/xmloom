# Engineering

개발 규칙이 제품 요구사항이나 화면/변환 스펙과 충돌하면 [Docs Hub](../README.md)에서 source of truth를 확인한다.

## Environment

- Package manager는 `pnpm`을 사용한다.
- App code는 `src/` 아래에 둔다.
- import alias는 `@/*`가 `src/*`를 가리킨다.
- shadcn generated component는 `src/components/shadcn` 아래에 둔다.

## Commands

```bash
pnpm dev
pnpm lint
pnpm exec prettier . --check
pnpm exec prettier . --write
pnpm build
```

커밋 전 기본 확인은 `pnpm lint`와 `pnpm exec prettier . --check`다. 라우팅, Next 설정, server/client boundary, 빌드 산출물에 영향을 주는 변경은 `pnpm build`까지 실행한다.

## Commit Rules

Conventional Commits를 사용한다.

권장 type:

- `feat`: 사용자에게 보이는 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 포맷팅, 의미 없는 스타일 수정
- `refactor`: 동작을 바꾸지 않는 구조 개선
- `test`: 테스트 추가 또는 수정
- `chore`: 설정, 패키지, 빌드 작업

예시:

```text
docs: add initial product and engineering guides
feat: add rules-based xml preview
fix: escape xml text content
```

## Code Style

- TypeScript strict mode를 전제로 작성한다.
- Prettier 설정은 `.prettierrc`를 따른다.
- Tailwind class 정렬은 `prettier-plugin-tailwindcss`에 맡긴다.
- class 병합은 기존 `cn` helper를 사용한다.
- UI는 shadcn/radix와 lucide-react를 우선 사용한다.
- 복잡한 상태가 아니면 React local state로 시작한다.
- 여러 component가 공유하는 client state가 필요해질 때 Zustand를 사용한다.
- remote/server state가 필요할 때 TanStack Query를 사용한다.
- form validation은 React Hook Form과 Zod를 우선한다.

## Next.js Rules

이 프로젝트의 Next.js는 기존 지식과 다를 수 있다. Next.js 관련 코드를 쓰기 전에는 `node_modules/next/dist/docs/`에서 관련 문서를 먼저 확인한다.

기본 방향:

- App Router 구조를 따른다.
- Server Component를 기본으로 생각한다.
- browser API, local state, event handler가 필요한 component에만 client boundary를 둔다.
- metadata, font, layout 변경은 현재 `src/app/layout.tsx` 패턴을 먼저 확인한다.

## XML Conversion Rules

- 변환 로직은 UI와 분리 가능한 pure function으로 작성한다.
- 같은 입력은 같은 XML을 만들어야 한다.
- XML escape 처리를 빠뜨리지 않는다.
- tag name fallback은 순서 기반으로 안정적으로 만든다.
- 변환 규칙을 변경하면 `docs/specs/xml-conversion.md`, `docs/product/prd.md`, `docs/changelog/specs.md`도 함께 확인한다.

## Review Checklist

- 사용자가 기존에 만든 변경을 되돌리지 않았는가?
- `README.md` 또는 `docs/`와 구현이 충돌하지 않는가?
- lint와 format check가 통과하는가?
- 화면 변경은 mobile/tablet/desktop에서 레이아웃이 깨지지 않는가?
- 새 public behavior가 생겼다면 문서나 테스트 기준을 갱신했는가?
