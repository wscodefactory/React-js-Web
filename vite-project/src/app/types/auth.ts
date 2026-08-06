export const userRoles = ['user', 'editor', 'manager', 'admin', 'owner'] as const;

export type UserRole = (typeof userRoles)[number];

export type UserPermissions = {
  canReadContent: boolean;
  canEditContent: boolean;
  canManageData: boolean;
  canManageUsers: boolean;
  canManageOwners: boolean;
};

export type AppUserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  permissions: UserPermissions;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
};

export const roleLabels: Record<UserRole, string> = {
  user: '일반 회원',
  editor: '콘텐츠 편집자',
  manager: '데이터 관리자',
  admin: '관리자',
  owner: '최고 관리자',
};

export const roleDescriptions: Record<UserRole, string> = {
  user: '내 계정과 공개 자료를 볼 수 있습니다.',
  editor: '콘텐츠 작성과 수정까지 처리할 수 있습니다.',
  manager: '운영 데이터와 회원 목록을 확인할 수 있습니다.',
  admin: '회원 역할과 주요 데이터를 관리할 수 있습니다.',
  owner: '관리자 지정과 핵심 설정 변경까지 담당합니다.',
};

export const roleRank: Record<UserRole, number> = {
  user: 10,
  editor: 20,
  manager: 30,
  admin: 40,
  owner: 50,
};

export const roleOptions = userRoles.map((role) => ({
  label: roleLabels[role],
  value: role,
}));

const rolePermissions: Record<UserRole, UserPermissions> = {
  user: {
    canReadContent: true,
    canEditContent: false,
    canManageData: false,
    canManageUsers: false,
    canManageOwners: false,
  },
  editor: {
    canReadContent: true,
    canEditContent: true,
    canManageData: false,
    canManageUsers: false,
    canManageOwners: false,
  },
  manager: {
    canReadContent: true,
    canEditContent: true,
    canManageData: true,
    canManageUsers: false,
    canManageOwners: false,
  },
  admin: {
    canReadContent: true,
    canEditContent: true,
    canManageData: true,
    canManageUsers: true,
    canManageOwners: false,
  },
  owner: {
    canReadContent: true,
    canEditContent: true,
    canManageData: true,
    canManageUsers: true,
    canManageOwners: true,
  },
};

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && userRoles.includes(value as UserRole);
}

export function getRolePermissions(role: UserRole): UserPermissions {
  return rolePermissions[role];
}

export function hasRoleAtLeast(currentRole: UserRole, requiredRole: UserRole) {
  return roleRank[currentRole] >= roleRank[requiredRole];
}
