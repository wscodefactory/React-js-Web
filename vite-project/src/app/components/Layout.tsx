/**
 * Application layout shell.
 *
 * 역할:
 * - 모든 페이지에서 공통으로 보이는 Header를 렌더링한다.
 * - 현재 경로가 홈(`/`)인지 여부에 따라 레이아웃을 분기한다.
 * - 일반 페이지에서는 Sidebar / Main / Aside의 3열 구조를 만든다.
 *
 * 이 파일은 실제 페이지 내용을 그리는 곳이 아니라,
 * 각 페이지가 들어갈 "공통 배치 틀"을 제공하는 데 초점을 둔다.
 */
import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Card, CardContent } from './common';
import type { AsideItem } from '../types/common';

/**
 * 우측 보조 패널에 표시할 정적 예시 카드 데이터.
 *
 * 현재는 샘플 성격의 데이터이지만, 이후 CMS/JSON/API 기반 데이터로
 * 교체하더라도 `AsidePanel` 자체 구조는 그대로 재사용할 수 있다.
 */
const asideItems: AsideItem[] = [
  { title: '제작 메모', description: '홈, 라우팅, 검색, 다크모드 구조가 연결된 상태입니다.' },
  { title: '추천 탐색', description: 'Components와 Tools 섹션에서 재사용 패턴을 먼저 확인하세요.' },
  { title: '다음 작업', description: '개별 앱 데모의 카피, 인터랙션, 반응형 상태를 순서대로 다듬으면 좋습니다.' },
  { title: '검증 상태', description: '타입체크와 프로덕션 빌드가 통과하는 흐름을 유지합니다.' },
  { title: '콘텐츠 기준', description: '임시 문구 대신 화면 목적과 사용 흐름이 드러나는 문장으로 정리합니다.' },
  { title: '리소스', description: '공용 컴포넌트와 카탈로그 데이터를 기준으로 새 페이지를 확장합니다.' },
  { title: '문서화', description: '구조 변경 후 typedoc 문서를 갱신할 수 있습니다.' },
  { title: '지원 범위', description: '디자인 보강, 기능 연결, 브라우저 QA를 이어서 진행할 수 있습니다.' },
];

export interface AsideCardProps extends AsideItem {}

/**
 * 우측 패널에서 재사용되는 카드 단위 표현 컴포넌트.
 *
 * Aside 영역의 각 항목을 동일한 card UI로 감싸서 렌더링한다.
 * 화면상 의미는 단순하지만, 레이아웃 계층을 읽을 때
 * "보조 정보 카드"라는 개념을 분리해서 보여주는 역할이 있다.
 */
function AsideCard({ title, description }: AsideCardProps) {
  return (
    <Card>
      <CardContent>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </CardContent>
    </Card>
  );
}

/**
 * 일반 페이지 오른쪽의 보조 정보 패널.
 *
 * 홈 화면이 아닌 페이지에서만 사용되며, 현재는 정적 카드 목록을 표시한다.
 * 추후 광고, 도움말, 추천 콘텐츠, 문서 링크 영역으로 확장하기 쉬운 구조다.
 */
function AsidePanel() {
  return (
    <aside className="layout-aside">
      <div className="space-y-4">
        {asideItems.map((item) => (
          <AsideCard key={item.title} title={item.title} description={item.description} />
        ))}
      </div>
    </aside>
  );
}

/**
 * 전체 라우트 공통 레이아웃 컴포넌트.
 *
 * 동작 방식:
 * 1. 현재 경로를 확인한다.
 * 2. 홈(`/`)이면 단순한 메인 영역만 렌더링한다.
 * 3. 그 외 경로이면 sidebar + main + aside 구조를 렌더링한다.
 *
 * `Outlet`은 React Router가 현재 활성화된 하위 페이지를 끼워 넣는 자리다.
 */
export function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="layout-root">
      <Header />
      <div className="layout-content">
        {isHomePage ? (
          <main className="min-h-screen">
            <Outlet />
          </main>
        ) : (
          <div className="min-h-screen">
            <div className="layout-grid">
              <div className="layout-spacer" />

              <Sidebar />

              <main className="layout-main">
                <Outlet />
              </main>

              <AsidePanel />

              <div className="layout-spacer" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
