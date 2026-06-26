import { Calendar, Heart, Home, Mail, Settings, ShoppingCart, Star, UserCircle } from 'lucide-react';
import type { IconAsset, SvgLibraryDraft } from './types';

export const iconAssets: IconAsset[] = [
  { id: 'user-circle', name: 'User Circle', category: 'Users', Icon: UserCircle },
  { id: 'shopping-cart', name: 'Shopping Cart', category: 'Commerce', Icon: ShoppingCart },
  { id: 'heart', name: 'Heart', category: 'Social', Icon: Heart },
  { id: 'star', name: 'Star', category: 'Rating', Icon: Star },
  { id: 'home', name: 'Home', category: 'Navigation', Icon: Home },
  { id: 'settings', name: 'Settings', category: 'System', Icon: Settings },
  { id: 'mail', name: 'Mail', category: 'Communication', Icon: Mail },
  { id: 'calendar', name: 'Calendar', category: 'Time', Icon: Calendar },
];

export const customSvgLibraryStorageKey = 'web5:custom-svg-library:v1';

export const svgSizeOptions = [16, 24, 32, 48];

export const fallbackSvgLibraryDraft: SvgLibraryDraft = {
  color: '#16a34a',
  customIcons: [],
  selectedCategory: 'All',
  size: 32,
};

export const lucideSvgPaths: Record<string, string> = {
  'User Circle': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20c1.2-2.4 3-3.5 5-3.5s3.8 1.1 5 3.5"/>',
  'Shopping Cart': '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  Heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
  Star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1z"/>',
  Home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  Settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z"/>',
  Mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  Calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
};
