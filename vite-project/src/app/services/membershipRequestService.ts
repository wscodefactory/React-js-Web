import type { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  isMembershipRequestStatus,
  type MembershipRequest,
  type MembershipRequestStatus,
} from '../types/membership-request';

type ReviewStatus = Extract<MembershipRequestStatus, 'approved' | 'rejected'>;

function requireDb() {
  if (!db) {
    throw new Error('Firestore 환경변수가 설정되지 않았습니다.');
  }

  return db;
}

function normalizeMembershipRequest(
  requestDoc: DocumentSnapshot<DocumentData>,
): MembershipRequest | null {
  if (!requestDoc.exists()) {
    return null;
  }

  const data = requestDoc.data();

  if (!isMembershipRequestStatus(data.status) || data.requestedPlan !== 'pro') {
    return null;
  }

  return {
    displayName: typeof data.displayName === 'string' ? data.displayName : null,
    email: typeof data.email === 'string' ? data.email : '',
    requestedAt: data.requestedAt,
    requestedPlan: 'pro',
    reviewedAt: data.reviewedAt,
    reviewedBy: typeof data.reviewedBy === 'string' ? data.reviewedBy : null,
    status: data.status,
    uid: typeof data.uid === 'string' ? data.uid : requestDoc.id,
    updatedAt: data.updatedAt,
  };
}

export async function getMembershipRequest(userId: string) {
  const snapshot = await getDoc(doc(requireDb(), 'membershipRequests', userId));
  return normalizeMembershipRequest(snapshot);
}

export async function submitMembershipRequest(user: User) {
  if (!user.email) {
    throw new Error('이메일이 등록된 계정만 프로 등급을 신청할 수 있습니다.');
  }

  const requestRef = doc(requireDb(), 'membershipRequests', user.uid);

  await setDoc(requestRef, {
    displayName: user.displayName,
    email: user.email,
    requestedAt: serverTimestamp(),
    requestedPlan: 'pro',
    reviewedAt: null,
    reviewedBy: null,
    status: 'pending',
    uid: user.uid,
    updatedAt: serverTimestamp(),
  });

  return getMembershipRequest(user.uid);
}

export async function cancelMembershipRequest(userId: string) {
  await updateDoc(doc(requireDb(), 'membershipRequests', userId), {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  });

  return getMembershipRequest(userId);
}

export async function listMembershipRequests(maxCount = 100): Promise<MembershipRequest[]> {
  const snapshot = await getDocs(query(
    collection(requireDb(), 'membershipRequests'),
    orderBy('requestedAt', 'desc'),
    limit(maxCount),
  ));

  return snapshot.docs
    .map(normalizeMembershipRequest)
    .filter((request): request is MembershipRequest => request !== null);
}

export async function reviewMembershipRequest(
  userId: string,
  status: ReviewStatus,
  reviewerId: string,
) {
  await updateDoc(doc(requireDb(), 'membershipRequests', userId), {
    reviewedAt: serverTimestamp(),
    reviewedBy: reviewerId,
    status,
    updatedAt: serverTimestamp(),
  });
}
