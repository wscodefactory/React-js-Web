import { ReactNode } from 'react';

/**
 * 공용 카드 컨테이너 props.
 *
 * hover와 onClick을 분리해 두어
 * "보여주기만 하는 카드"와 "상호작용 가능한 카드"를 모두 표현할 수 있다.
 */
interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * 프로젝트 전반에서 재사용하는 카드 외곽 래퍼.
 *
 * 역할:
 * - 카드 공통 외형 제공
 * - hover 여부에 따른 강조 스타일 적용
 * - 클릭 가능한 카드일 때 커서 스타일 표시
 */
export function Card({ children, hover = false, className = '', onClick }: CardProps) {
  const hoverClass = hover ? 'card-hover' : '';
  const clickable = onClick ? 'cursor-pointer' : '';

  return (
    <article className={`card ${hoverClass} ${clickable} ${className}`} onClick={onClick}>
      {children}
    </article>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

/**
 * 카드 상단 헤더 영역.
 *
 * 제목, 설명, 아이콘, 배지를 표준화된 형태로 배치한다.
 * 다양한 카드가 동일한 정보 계층을 갖게 만드는 데 유용하다.
 */
export function CardHeader({ title, description, icon, badge }: CardHeaderProps) {
  return (
    <header className="card-padding">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
          <div className="flex-1 min-w-0">
            <h3 className="card-title">{title}</h3>
            {description && <p className="card-description">{description}</p>}
          </div>
        </div>
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>
    </header>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * 카드 본문 영역.
 */
export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`card-padding ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * 카드 하단 액션/보조 정보 영역.
 */
export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <footer className={`card-padding border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </footer>
  );
}
