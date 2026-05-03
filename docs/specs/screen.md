# Screen Spec

스펙 버전: `SPEC-SCREEN-2026-05-03-001`  
상태: Draft  
마지막 갱신일: 2026-05-03

화면 스펙이 바뀌면 [Spec Changelog](../changelog/specs.md)를 함께 갱신한다.

## Viewport Tiers

- Mobile: `<768px`
- Tablet: `768px-1023px`
- Desktop: `>=1024px`

Tailwind CSS의 기본 breakpoint 감각을 따른다. 구현 시 breakpoint 이름이 달라졌거나 Next/Tailwind 설정이 바뀌면 실제 설정을 우선한다.

## Layout Principles

- 첫 화면은 landing page가 아니라 XML 변환 작업 화면이다.
- 전체 spacing은 4px 기반 scale을 사용한다.
- 기본 page padding은 mobile `16px`, tablet `24px`, desktop `32px`다.
- 주요 영역 간 gap은 mobile `16px`, tablet `20px`, desktop `24px`다.
- desktop에서 main content의 권장 max width는 `1200px`다.
- card radius는 shadcn 기본 radius를 따르되, 반복 item과 tool panel은 `8px` 이하 느낌을 유지한다.

## App Shell

- 상단에는 product name, 짧은 상태 정보, 주요 액션만 둔다.
- 본문은 입력 영역과 XML preview 영역으로 구성한다.
- marketing hero, 장식용 gradient, 기능 설명용 큰 섹션은 만들지 않는다.
- 사용자가 화면에 들어오면 바로 field 입력과 XML 결과 영역을 볼 수 있어야 한다.

## Mobile

- 단일 column layout을 사용한다.
- 순서는 입력 영역, action row, XML preview 순서다.
- header 높이는 약 `56px`를 기준으로 한다.
- 입력 블록은 세로로 쌓고, block 내부 gap은 `8px-12px`를 사용한다.
- primary action은 엄지 조작이 쉬운 위치에 둔다.
- preview는 가로 스크롤을 허용하되, page 전체가 가로 스크롤되지 않게 한다.

## Tablet

- 기본은 넓은 단일 column 또는 균형 잡힌 2-column 중 실제 너비에 맞춘다.
- `768px` 이상에서 입력과 preview를 나란히 놓을 수 있으면 2-column을 허용한다.
- 2-column 사용 시 입력 영역은 최소 `320px`, preview 영역은 남은 폭을 사용한다.
- 영역 간 gap은 `20px`를 기본으로 한다.

## Desktop

- 2-column layout을 기본으로 한다.
- 입력 영역은 `minmax(360px, 5fr)`, preview 영역은 `minmax(0, 7fr)`에 가까운 비율을 사용한다.
- header 높이는 약 `64px`를 기준으로 한다.
- preview 영역은 긴 XML을 읽기 쉽게 충분한 세로 공간을 가진다.
- action은 입력 영역 하단 또는 header 우측에 모으되, 같은 action을 여러 곳에 중복 배치하지 않는다.

## Required UI States

- Empty: 입력이 없을 때 변환 결과가 아직 없음을 보여준다.
- Editing: 사용자가 입력 중일 때 preview가 즉시 갱신된다.
- Invalid field name: 안전하지 않은 field name은 fallback tag name으로 변환되며, 필요하면 보조 문구로 원인을 알려준다.
- Copy success: 복사 완료 상태를 짧게 표시한다.
- Copy failure: clipboard API 실패 시 사용자가 결과를 직접 선택할 수 있게 preview는 항상 읽을 수 있어야 한다.

## Component Guidance

- shadcn/radix component를 우선 사용한다.
- shadcn component를 새로 추가하거나 수정할 때는 [Agent Skills](../agents/skills.md)의 shadcn/ui workflow를 따른다.
- button에는 가능한 lucide-react icon을 함께 사용한다.
- field 추가/삭제, 복사, 초기화 같은 도구 액션은 icon button 또는 icon+text button을 사용한다.
- 숫자, 토글, option 선택이 생기면 input type에 맞는 control을 사용한다.
- tooltip은 icon만으로 의미가 불명확한 액션에 붙인다.

## Accessibility

- 입력 field와 preview에는 명확한 accessible name을 제공한다.
- keyboard만으로 field 추가, 삭제, 변환, 복사를 수행할 수 있어야 한다.
- error나 상태 변화는 시각 정보만으로 전달하지 않는다.
- preview code block은 충분한 contrast와 focus outline을 유지한다.
