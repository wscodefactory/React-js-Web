import type { UserRole } from './auth';
import type { RouteSectionKey } from './navigation';

export const configurableSectionKeys = ['components', 'full-apps', 'libraries', 'tools', 'mcp', 'projects', 'security', 'workspace'] as const;

export type ConfigurableSectionKey = Extract<RouteSectionKey, (typeof configurableSectionKeys)[number]>;

export type PageAccessLevel = 'public' | 'signedIn' | UserRole;

export type SiteMenuVisibility = Record<ConfigurableSectionKey, boolean>;

export type SitePageAccess = Record<ConfigurableSectionKey, PageAccessLevel>;

export type SiteSettings = {
  maintenanceMode: boolean;
  menuVisibility: SiteMenuVisibility;
  pageAccess: SitePageAccess;
  signupEnabled: boolean;
  updatedAt?: unknown;
  updatedBy?: string | null;
};

export const configurableSectionLabels: Record<ConfigurableSectionKey, string> = {
  components: 'Components',
  'full-apps': 'Full Apps',
  libraries: 'Libraries',
  tools: 'Tools',
  mcp: 'MCP',
  projects: 'Projects',
  security: 'Security',
  workspace: 'Workspace',
};

export const pageAccessLevels = ['public', 'signedIn', 'user', 'editor', 'manager', 'admin', 'owner'] as const;

export const pageAccessLabels: Record<PageAccessLevel, string> = {
  public: '전체 공개',
  signedIn: '로그인 회원',
  user: '일반 회원 이상',
  editor: '콘텐츠 편집자 이상',
  manager: '데이터 관리자 이상',
  admin: '관리자 이상',
  owner: '최고 관리자만',
};

export const pageAccessOptions = pageAccessLevels.map((level) => ({
  label: pageAccessLabels[level],
  value: level,
}));

export const defaultMenuVisibility: SiteMenuVisibility = {
  components: true,
  'full-apps': true,
  libraries: true,
  tools: true,
  mcp: true,
  projects: true,
  security: true,
  workspace: true,
};

export const defaultPageAccess: SitePageAccess = {
  components: 'public',
  'full-apps': 'public',
  libraries: 'public',
  tools: 'public',
  mcp: 'public',
  projects: 'signedIn',
  security: 'signedIn',
  workspace: 'signedIn',
};

export const defaultSiteSettings: SiteSettings = {
  maintenanceMode: false,
  menuVisibility: defaultMenuVisibility,
  pageAccess: defaultPageAccess,
  signupEnabled: true,
  updatedBy: null,
};

export function isConfigurableSectionKey(value: unknown): value is ConfigurableSectionKey {
  return typeof value === 'string' && configurableSectionKeys.includes(value as ConfigurableSectionKey);
}

export function isPageAccessLevel(value: unknown): value is PageAccessLevel {
  return typeof value === 'string' && pageAccessLevels.includes(value as PageAccessLevel);
}

export function getRequiredRoleForAccess(accessLevel: PageAccessLevel): UserRole | undefined {
  if (accessLevel === 'public' || accessLevel === 'signedIn') {
    return undefined;
  }

  return accessLevel;
}
