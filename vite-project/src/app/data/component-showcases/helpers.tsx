import type { ReactNode } from 'react';

export function PreviewStack({ children }: { children?: ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

export function GhostPanel({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  );
}
