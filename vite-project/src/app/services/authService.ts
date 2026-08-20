import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import {
  getRolePermissions,
  isMembershipPlan,
  isUserRole,
  type AppUserProfile,
  type UserRole,
} from '../types/auth';

export type EmailAuthForm = {
  email: string;
  password: string;
};

export type SignupForm = EmailAuthForm & {
  displayName: string;
};

export const emailVerificationRequiredCode = 'auth/email-not-verified';
export const emailAlreadyVerifiedCode = 'auth/email-already-verified';

function createAuthServiceError(code: string, message: string) {
  return Object.assign(new Error(message), { code });
}

function requireAuth() {
  if (!auth) {
    throw new Error('Firebase 환경변수가 설정되지 않았습니다.');
  }

  return auth;
}

function requireDb() {
  if (!db) {
    throw new Error('Firestore 환경변수가 설정되지 않았습니다.');
  }

  return db;
}

function normalizeUserProfile(uid: string, data: Record<string, unknown>): AppUserProfile {
  const membershipPlan = isMembershipPlan(data.membershipPlan) ? data.membershipPlan : 'free';
  const role = isUserRole(data.role) ? data.role : 'user';

  return {
    uid,
    createdAt: data.createdAt,
    displayName: typeof data.displayName === 'string' ? data.displayName : null,
    email: typeof data.email === 'string' ? data.email : null,
    emailVerified: typeof data.emailVerified === 'boolean' ? data.emailVerified : false,
    lastLoginAt: data.lastLoginAt,
    membershipPlan,
    permissions: getRolePermissions(role),
    role,
    updatedAt: data.updatedAt,
  };
}

export async function saveUserProfile(user: User) {
  const profileRef = doc(requireDb(), 'users', user.uid);
  const snapshot = await getDoc(profileRef);

  if (snapshot.exists()) {
    await setDoc(
      profileRef,
      {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        lastLoginAt: serverTimestamp(),
        uid: user.uid,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return;
  }

  await setDoc(profileRef, {
    createdAt: serverTimestamp(),
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    lastLoginAt: serverTimestamp(),
    membershipPlan: 'free',
    permissions: getRolePermissions('user'),
    role: 'user',
    uid: user.uid,
    updatedAt: serverTimestamp(),
  });
}

export async function registerWithEmail({ displayName, email, password }: SignupForm): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(requireAuth(), email, password);
  const trimmedDisplayName = displayName.trim();

  if (trimmedDisplayName) {
    await updateProfile(credential.user, { displayName: trimmedDisplayName });
  }

  await setDoc(
    doc(requireDb(), 'users', credential.user.uid),
    {
      createdAt: serverTimestamp(),
      displayName: trimmedDisplayName || null,
      email: credential.user.email,
      emailVerified: credential.user.emailVerified,
      lastLoginAt: serverTimestamp(),
      membershipPlan: 'free',
      permissions: getRolePermissions('user'),
      role: 'user',
      uid: credential.user.uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await sendEmailVerification(credential.user);

  return credential;
}

export async function loginWithEmail({ email, password }: EmailAuthForm): Promise<UserCredential> {
  const credential = await signInWithEmailAndPassword(requireAuth(), email, password);

  await credential.user.reload();

  if (!credential.user.emailVerified) {
    await sendEmailVerification(credential.user);
    await signOut(requireAuth());
    throw createAuthServiceError(
      emailVerificationRequiredCode,
      '인증 메일을 다시 보냈습니다. 메일함의 인증 링크를 누른 뒤 로그인해주세요.',
    );
  }

  try {
    await saveUserProfile(credential.user);
  } catch (error) {
    console.warn('Failed to update user profile after login.', error);
  }

  return credential;
}

export async function resendVerificationEmail({ email, password }: EmailAuthForm) {
  const credential = await signInWithEmailAndPassword(requireAuth(), email, password);

  await credential.user.reload();

  if (credential.user.emailVerified) {
    await signOut(requireAuth());
    throw createAuthServiceError(emailAlreadyVerifiedCode, '이미 인증된 계정입니다. 로그인해주세요.');
  }

  await sendEmailVerification(credential.user);
  await signOut(requireAuth());
}

export async function logout() {
  await signOut(requireAuth());
}

export function hasPasswordProvider(user: User) {
  return user.providerData.some((provider) => provider.providerId === 'password');
}

export async function changeUserPassword(user: User, currentPassword: string, newPassword: string) {
  if (!user.email || !hasPasswordProvider(user)) {
    throw createAuthServiceError('auth/password-provider-required', '이 계정은 이메일 비밀번호 변경을 지원하지 않습니다.');
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export async function sendCurrentUserPasswordReset(user: User) {
  if (!user.email || !hasPasswordProvider(user)) {
    throw createAuthServiceError('auth/password-provider-required', '이 계정은 비밀번호 재설정 메일을 지원하지 않습니다.');
  }

  await sendPasswordResetEmail(requireAuth(), user.email);
}

export async function fetchUserProfile(uid: string): Promise<AppUserProfile | null> {
  const snapshot = await getDoc(doc(requireDb(), 'users', uid));

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeUserProfile(uid, snapshot.data());
}

export async function listUserProfiles(maxCount = 100): Promise<AppUserProfile[]> {
  const snapshot = await getDocs(query(collection(requireDb(), 'users'), limit(maxCount)));

  return snapshot.docs.map((userDoc) => normalizeUserProfile(userDoc.id, userDoc.data()));
}

export async function updateUserProfileRole(uid: string, role: UserRole) {
  await updateDoc(doc(requireDb(), 'users', uid), {
    permissions: getRolePermissions(role),
    role,
    updatedAt: serverTimestamp(),
  });
}
