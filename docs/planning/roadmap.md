# Roadmap

이 문서는 방향을 맞추기 위한 작업 순서다. 일정 약속이 아니라 구현 우선순위와 완료 기준을 기록한다.

## v0: Documentation Baseline

목표:

- README와 핵심 docs를 만든다.
- Agent가 다시 들어와도 제품 의도, 화면 규칙, 개발 규칙을 찾을 수 있게 한다.
- Next.js 16 관련 주의사항을 유지한다.

완료 기준:

- `README.md`가 프로젝트 목적과 문서 인덱스를 제공한다.
- `docs/README.md`가 문서 허브 역할을 한다.
- `docs/product/`, `docs/specs/`, `docs/development/`, `docs/agents/`, `docs/planning/`, `docs/changelog/`가 존재한다.
- PRD와 스펙 변경 이력이 추적 가능하다.
- `AGENTS.md`가 문서 재진입 경로를 안내한다.

## v1: Rules-Based XML MVP

목표:

- 사용자가 복수 입력 field를 만들고 삭제할 수 있다.
- 사용자가 parent field 아래 child field를 만들어 nested XML을 구성할 수 있다.
- field name과 text content를 XML로 변환한다.
- XML preview, copy, reset을 제공한다.
- EN/KO language toggle을 제공한다.
- mobile/tablet/desktop 레이아웃을 구현한다.

완료 기준:

- 같은 입력은 같은 XML을 만든다.
- XML text content가 안전하게 escape된다.
- field name fallback이 안정적으로 동작한다.
- parent content와 child tags가 함께 있을 때 읽기 쉬운 block format으로 출력된다.
- copy success/failure는 toast로 표시된다.
- 빈 입력과 invalid field name 상태가 UI에서 처리된다.
- 구현이 `docs/product/prd.md`, `docs/specs/xml-conversion.md`, `docs/specs/screen.md`와 일치한다.
- `pnpm lint`, `pnpm exec prettier . --check`, 필요 시 `pnpm build`가 통과한다.

## v2: Templates And Validation

목표:

- root wrapper option이나 template preset을 필요에 따라 제공한다.
- 자주 쓰는 XML template 또는 preset을 제공한다.
- 더 명확한 validation message와 preview affordance를 추가한다.

완료 기준:

- template 선택 후에도 v1 변환 규칙이 예측 가능하게 유지된다.
- validation error가 사용자가 고칠 수 있는 단위로 표시된다.
- 문서와 구현의 변환 규칙이 일치한다.

## v3: AI-Assisted Conversion Candidate

목표:

- 규칙 기반 변환을 유지한 상태에서 AI 보조 기능을 선택적으로 검토한다.
- OpenAI API를 사용할 경우 secret은 server side에서만 다룬다.
- AI 출력은 XML validation과 사용자 확인 과정을 거친다.

완료 기준:

- AI 기능을 켜지 않아도 v1/v2 기능이 정상 동작한다.
- AI 결과는 deterministic core path를 대체하지 않고 보조 기능으로 유지된다.
- 실패, timeout, invalid XML에 대한 fallback UX가 있다.
