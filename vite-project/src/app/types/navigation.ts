import type { ComponentType } from 'react';
import type { NavigationPathItem } from './common';

export type RouteSectionKey = 'home' | 'components' | 'full-apps' | 'libraries' | 'tools' | 'mcp';

export interface RoutePageDefinition {
  label: string;
  slug?: string;
  description: string;
  badge?: string;
  searchKeywords?: string[];
  component: ComponentType;
  includeInSidebar?: boolean;
  includeInSearch?: boolean;
}

export interface RouteSectionDefinition {
  key: RouteSectionKey;
  label: string;
  basePath: `/${string}`;
  landingDescription: string;
  landingComponent: ComponentType;
  children?: RoutePageDefinition[];
}

export interface NavigationLinkItem extends NavigationPathItem {}

export interface SidebarItem {
  name: string;
  path: string;
  badge?: string;
}

export interface SearchItem {
  name: string;
  description: string;
  path: string;
  category: string;
  keywords: string[];
}
