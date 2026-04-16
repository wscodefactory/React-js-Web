import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

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

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`card-padding ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <footer className={`card-padding border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </footer>
  );
}
