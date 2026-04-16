import type { MouseEvent, PropsWithChildren } from 'react';

export type WithChildren<T = {}> = PropsWithChildren<T>;

export interface SelectOption {
  value: string;
  label: string;
}

export interface NavigationPathItem {
  name: string;
  path: string;
}

export interface AsideItem {
  title: string;
  description: string;
}

export interface StoredRecentSearch {
  name: string;
  path: string;
  timestamp: number;
}

export type ClickEvent = MouseEvent<HTMLElement>;
