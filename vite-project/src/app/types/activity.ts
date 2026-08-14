import type { UserRole } from './auth';

export const activityActions = [
  'auth.login',
  'auth.logout',
  'workspace.version.created',
  'workspace.version.restored',
  'admin.role.updated',
  'admin.settings.updated',
] as const;

export type ActivityAction = (typeof activityActions)[number];

export type ActivityLog = {
  action: ActivityAction;
  actorDisplayName: string | null;
  actorEmail: string | null;
  actorRole: UserRole;
  actorUid: string;
  createdAt?: unknown;
  details?: string | null;
  id: string;
  summary: string;
  targetId?: string | null;
};

export const activityActionLabels: Record<ActivityAction, string> = {
  'auth.login': '로그인',
  'auth.logout': '로그아웃',
  'workspace.version.created': '워크스페이스 버전 저장',
  'workspace.version.restored': '워크스페이스 버전 복원',
  'admin.role.updated': '회원 권한 변경',
  'admin.settings.updated': '사이트 설정 변경',
};
