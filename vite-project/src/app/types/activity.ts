import type { UserRole } from './auth';

export const activityActions = [
  'auth.login',
  'auth.logout',
  'auth.password.updated',
  'auth.password.reset-requested',
  'workspace.version.created',
  'workspace.version.restored',
  'project.created',
  'project.updated',
  'project.duplicated',
  'project.archived',
  'project.restored',
  'project.deleted',
  'membership.request.created',
  'membership.request.cancelled',
  'admin.membership.reviewed',
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
  'auth.password.updated': '비밀번호 변경',
  'auth.password.reset-requested': '비밀번호 재설정 요청',
  'workspace.version.created': '워크스페이스 버전 저장',
  'workspace.version.restored': '워크스페이스 버전 복원',
  'project.created': '프로젝트 생성',
  'project.updated': '프로젝트 수정',
  'project.duplicated': '프로젝트 복제',
  'project.archived': '프로젝트 보관',
  'project.restored': '프로젝트 보관 해제',
  'project.deleted': '프로젝트 삭제',
  'membership.request.created': '프로 등급 신청',
  'membership.request.cancelled': '프로 등급 신청 취소',
  'admin.membership.reviewed': '프로 등급 신청 처리',
  'admin.role.updated': '회원 권한 변경',
  'admin.settings.updated': '사이트 설정 변경',
};
