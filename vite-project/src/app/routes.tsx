import type { ComponentType } from 'react';

/**
 * Browser router created from central route metadata.
 *
 * 설계 의도:
 * - 실제 경로 정의를 여러 파일에 분산하지 않고
 *   `config/navigation.tsx`의 메타데이터를 단일 원천(source of truth)으로 삼는다.
 * - Header / Sidebar / SearchModal / Router가 같은 경로 정의를 공유하게 만든다.
 *
 * 새 페이지를 추가할 때는 이 파일보다 먼저
 * `src/app/config/navigation.tsx`를 수정하는 것이 우선이다.
 */
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { routeSections } from './config/navigation';

/**
 * navigation 메타데이터를 실제 React Router child route 배열로 변환한다.
 *
 * 변환 규칙:
 * - 홈(`/`) 섹션은 index route로 등록
 * - 나머지 섹션은 basePath에서 앞의 `/`를 제거한 값을 path로 사용
 * - child 항목은 slug를 그대로 path로 사용
 */
const childRoutes = routeSections.flatMap((section) => {
  const routes = [] as Array<{ index?: true; path?: string; Component: ComponentType }>;

  if (section.basePath === '/') {
    routes.push({ index: true, Component: section.landingComponent });
  } else {
    routes.push({ path: section.basePath.slice(1), Component: section.landingComponent });
  }

  for (const child of section.children ?? []) {
    if (!child.slug) continue;
    routes.push({ path: child.slug, Component: child.component });
  }

  return routes;
});

/**
 * 앱 전체 라우터 인스턴스.
 *
 * 최상위 경로(`/`)에 Layout을 배치하고,
 * 실제 각 페이지는 그 하위 children으로 주입된다.
 * Layout 내부의 `Outlet`이 child route 렌더링 지점이다.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: childRoutes,
  },
]);
