# XMLoom

XMLoom은 사용자가 자연어로 대충 적은 입력을 예측 가능한 XML 형식으로 정리해주는 웹서비스입니다.

초기 MVP는 OpenAI API나 LLM 없이 규칙 기반 변환으로 시작합니다. 사용자는 하나 이상의 Text field에 내용을 입력하고, 필요하면 child field를 추가해 nested XML을 만든 뒤 결과를 미리보기, 복사, 초기화할 수 있습니다.

## Current Status

- Next.js 기반 규칙 XML 변환 workbench입니다.
- root wrapper 없는 sibling XML tag와 nested child tag 출력을 지원합니다.
- EN/KO language toggle과 clipboard toast feedback을 제공합니다.
- AI 보조 변환은 v1 이후 확장 후보이며, 현재 기본 동작으로 가정하지 않습니다.

## Tech Stack

- Next.js `16.2.4`
- React `19.2.4`
- TypeScript `5`
- Tailwind CSS `4`
- shadcn/radix UI, lucide-react
- next-intl, sonner
- React Hook Form, Zod
- TanStack Query
- Zustand
- ESLint `9`, Prettier `3`

## Getting Started

```bash
pnpm install
pnpm dev
```

개발 서버는 기본적으로 Next.js가 안내하는 로컬 주소에서 실행됩니다.

## Useful Commands

```bash
pnpm dev
pnpm lint
pnpm exec prettier . --check
pnpm exec prettier . --write
pnpm build
```

커밋 전에는 최소한 `pnpm lint`와 `pnpm exec prettier . --check`를 통과시킵니다. 화면이나 빌드 동작에 영향을 주는 변경은 `pnpm build`까지 확인합니다.

## Documentation

- [Docs Hub](./docs/README.md): Codex, Claude, 사람 개발자가 함께 보는 문서 시작점
- [Product PRD](./docs/product/prd.md): 제품 요구사항, MVP 범위, acceptance criteria
- [Product Overview](./docs/product/overview.md): 제품 목표와 규칙 기반 변환 요약
- [XML Conversion Spec](./docs/specs/xml-conversion.md): XML 변환 입력/출력, tag fallback, escaping 규칙
- [Screen Spec](./docs/specs/screen.md): mobile/tablet/desktop 화면 기준, spacing, 상태별 UI
- [Engineering](./docs/development/engineering.md): 코드 관리, 커밋 규칙, 검증 명령어, 구현 원칙
- [Agent Guide](./docs/agents/guide.md): Agent가 다시 들어왔을 때 읽을 순서와 작업 방식
- [Agent Skills](./docs/agents/skills.md): Codex/Claude 공용 local skill과 shadcn/ui 사용 절차
- [PRD Changelog](./docs/changelog/prd.md), [Spec Changelog](./docs/changelog/specs.md): PRD와 스펙 변경 내역
- [Roadmap](./docs/planning/roadmap.md): v0 문서화부터 v3 AI 보조 변환까지의 단계

## Development Principles

- 사용자가 첫 화면에서 바로 변환 작업을 시작할 수 있는 앱 화면을 우선합니다.
- MVP 변환은 deterministic 해야 합니다. 같은 입력은 같은 XML을 만들어야 합니다.
- XML 결과는 escape, validation, empty state를 명확히 처리합니다.
- UI는 shadcn/radix와 Tailwind CSS 4 기반의 기존 설정을 우선 사용합니다.
- shadcn/ui 작업이 많다면 Codex 또는 Claude에 shadcn/ui skill을 로컬로 설치해두면 컴포넌트 추가, 조합, 업데이트 규칙을 일관되게 유지하는 데 유용합니다.
- 로컬 agent skill 폴더인 `.agents/`, `.claude/`는 개인 개발 환경 설정이므로 git에서 추적하지 않습니다.
- 이 프로젝트의 Next.js는 기존 지식과 다를 수 있으므로, Next.js 관련 코드를 작성하기 전 `node_modules/next/dist/docs/`의 관련 문서를 확인합니다.
- PRD나 스펙을 바꾸는 작업은 `docs/changelog/`의 변경 이력도 함께 갱신합니다.
