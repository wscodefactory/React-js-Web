# Common Components Guide

이 폴더는 프로젝트 전반에서 반복 사용하는 **UI 프리미티브 계층**입니다.

## 목적
페이지마다 버튼, 카드, 입력 필드를 새로 만들지 않고  
공통 스타일과 인터페이스를 재사용하기 위해 존재합니다.

## 포함 컴포넌트

### `Button.tsx`
- 일반 버튼과 아이콘 버튼 제공
- variant 기반 스타일 분기
- 클릭, disabled, type 등 기본 HTML button 속성을 그대로 전달 가능

### `Card.tsx`
- 카드 외곽 컨테이너
- Header / Content / Footer 조합 지원
- hover 여부와 clickability를 표현 가능

### `FormField.tsx`
- label + field 묶음 제공
- Input / Select / ColorInput 같은 입력 도우미 포함
- 폼 UI의 기본적인 일관성을 유지

### `Section.tsx`
- 제목, 설명, 섹션 레이아웃 같은 블록 단위 구성을 도와주는 래퍼

## 사용 원칙
1. 페이지 전용 스타일이 아니라면 먼저 common으로 올릴 수 있는지 검토합니다.
2. 너무 복잡한 비즈니스 로직은 common에 넣지 않습니다.
3. common은 “재사용 가능한 껍데기”에 가깝게 유지합니다.
4. 페이지 고유 맥락이 필요한 경우는 showcase/catalog/page 내부에 둡니다.

## 좋은 예
- 여러 페이지에서 같은 모양으로 쓰는 버튼
- 카드형 정보 박스
- 라벨 포함 입력 필드

## 피해야 할 예
- 특정 페이지에서만 쓰는 복잡한 API 호출 로직
- 특정 화면 문맥에만 맞는 거대한 조립 컴포넌트

