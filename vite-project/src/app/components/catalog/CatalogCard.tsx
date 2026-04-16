import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent } from '../common';
import type { CatalogItem } from '../../types/catalog';

interface CatalogCardProps {
  item: CatalogItem;
}

export function CatalogCard({ item }: CatalogCardProps) {
  const Icon = item.icon;

  return (
    <Link to={item.path} className="block h-full">
      <Card hover className="h-full">
        <CardContent className="space-y-4 h-full flex flex-col">
          <div className="w-full h-32 bg-green-50 dark:bg-green-900/20 rounded-md flex items-center justify-center">
            {Icon ? <Icon className="w-12 h-12 text-primary" /> : <span className="text-gray-400 dark:text-gray-500">Preview</span>}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="card-title">{item.name}</h3>
              <ArrowUpRight className="icon-sm text-gray-400 flex-shrink-0 mt-1" />
            </div>
            <p className="card-description">{item.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.category && <span className="badge badge-success">#{item.category}</span>}
            {item.badge && <span className="badge badge-primary">{item.badge}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
