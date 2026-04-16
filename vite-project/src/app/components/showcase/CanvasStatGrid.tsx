import type { CanvasStatItem } from '@/app/types/showcase';

interface CanvasStatGridProps {
  items: CanvasStatItem[];
}

export function CanvasStatGrid({ items }: CanvasStatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <p className="mb-1 text-gray-500 dark:text-gray-400">{item.label}</p>
          <p className="text-gray-900 dark:text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
