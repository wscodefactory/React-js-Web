import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className = '' }: SectionProps) {
  return <section className={`section ${className}`}>{children}</section>;
}

interface SectionHeaderProps {
  title: string;
  titleHighlight?: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ title, titleHighlight, description, className = '' }: SectionHeaderProps) {
  return (
    <header className={`section-header ${className}`}>
      <h1 className="section-title">
        {titleHighlight ? (
          <>
            <span className="section-title-highlight">{titleHighlight}</span> {title}
          </>
        ) : (
          title
        )}
      </h1>
      {description && <p className="section-description">{description}</p>}
    </header>
  );
}
