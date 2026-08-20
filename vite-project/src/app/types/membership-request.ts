export const membershipRequestStatuses = ['pending', 'approved', 'rejected', 'cancelled'] as const;

export type MembershipRequestStatus = (typeof membershipRequestStatuses)[number];

export type MembershipRequest = {
  displayName: string | null;
  email: string;
  requestedAt?: unknown;
  requestedPlan: 'pro';
  reviewedAt?: unknown;
  reviewedBy: string | null;
  status: MembershipRequestStatus;
  uid: string;
  updatedAt?: unknown;
};

export const membershipRequestStatusLabels: Record<MembershipRequestStatus, string> = {
  approved: '적용 완료',
  cancelled: '신청 취소',
  pending: '검토 중',
  rejected: '승인 거절',
};

export function isMembershipRequestStatus(value: unknown): value is MembershipRequestStatus {
  return typeof value === 'string'
    && membershipRequestStatuses.includes(value as MembershipRequestStatus);
}
