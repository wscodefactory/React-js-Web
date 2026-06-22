import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent } from '../common';
import { useLanguage } from '../../context/LanguageContext';
import { catalogText, getCatalogItemCopy, localizeBadge } from '../../i18n';
import type { CatalogItem } from '../../types/catalog';

export interface CatalogCardProps {
  item: CatalogItem;
}

export function CatalogCard({ item }: CatalogCardProps) {
  const Icon = item.icon;
  const { language } = useLanguage();
  const text = catalogText[language];
  const itemCopy = getCatalogItemCopy(language, item);

  return (
    <Link to={item.path} className="block h-full">
      <Card hover className="h-full">
        <CardContent className="space-y-4 h-full flex flex-col">
          <div className="w-full h-32 bg-green-50 dark:bg-green-900/20 rounded-md flex items-center justify-center">
            {Icon ? <Icon className="w-12 h-12 text-primary" /> : <span className="text-gray-400 dark:text-gray-500">{text.preview}</span>}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <h3 className="card-title truncate">{itemCopy.name}</h3>
              <ArrowUpRight className="icon-sm text-gray-400 flex-shrink-0 mt-1" />
            </div>
            <p className="card-description line-clamp-2">{itemCopy.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {itemCopy.category && <span className="badge badge-success">#{itemCopy.category}</span>}
            {item.badge && <span className="badge badge-primary">{localizeBadge(language, item.badge)}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
