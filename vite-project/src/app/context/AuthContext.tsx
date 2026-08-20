import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { getIdTokenResult, onAuthStateChanged, reload, type User } from 'firebase/auth';
import { auth, isFirebaseConfigured, missingFirebaseConfigKeys } from '../services/firebase';
import { recordActivity } from '../services/activityService';
import {
  fetchUserProfile,
  loginWithEmail,
  logout,
  registerWithEmail,
  resendVerificationEmail,
  saveUserProfile,
  type EmailAuthForm,
  type SignupForm,
} from '../services/authService';
import {
  hasRoleAtLeast,
  isMembershipPlan,
  isUserRole,
  type AppUserProfile,
  type MembershipPlan,
  type UserRole,
} from '../types/auth';

type AuthClaims = Record<string, unknown>;

type AuthContextValue = {
  claims: AuthClaims;
  firebaseReady: boolean;
  hasRole: (requiredRole: UserRole) => boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  canUseProContent: boolean;
  membershipPlan: MembershipPlan;
  missingConfigKeys: readonly string[];
  profile: AppUserProfile | null;
  refreshSession: () => Promise<void>;
  resendVerification: (form: EmailAuthForm) => Promise<void>;
  role: UserRole;
  signIn: (form: EmailAuthForm) => Promise<UserRole>;
  signOut: () => Promise<void>;
  signUp: (form: SignupForm) => Promise<void>;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function usesPasswordProvider(sessionUser: User) {
  return sessionUser.providerData.some((provider) => provider.providerId === 'password');
}

function resolveRoleFromClaims(claims: AuthClaims): UserRole {
  if (isUserRole(claims.role)) {
    return claims.role;
  }

  if (claims.admin === true) {
    return 'admin';
  }

  return 'user';
}

function resolveMembershipPlanFromClaims(claims: AuthClaims): MembershipPlan {
  return isMembershipPlan(claims.membershipPlan) ? claims.membershipPlan : 'free';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<AuthClaims>({});
  const [isLoading, setIsLoading] = useState(true);
  const [membershipPlan, setMembershipPlan] = useState<MembershipPlan>('free');
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [user, setUser] = useState<User | null>(null);
  const isCreatingAccountRef = useRef(false);

  const loadSession = useCallback(async (sessionUser: User | null, forceRefresh = false) => {
    if (!sessionUser) {
      setClaims({});
      setMembershipPlan('free');
      setProfile(null);
      setRole('user');
      setUser(null);
      return null;
    }

    if (usesPasswordProvider(sessionUser)) {
      await reload(sessionUser);

      if (!sessionUser.emailVerified) {
        setClaims({});
        setMembershipPlan('free');
        setProfile(null);
        setRole('user');
        setUser(null);

        if (!isCreatingAccountRef.current) {
          await logout();
        }

        return null;
      }
    }

    const tokenResult = await getIdTokenResult(sessionUser, forceRefresh);
    const resolvedClaims = tokenResult.claims as AuthClaims;
    const resolvedMembershipPlan = resolveMembershipPlanFromClaims(resolvedClaims);
    const resolvedRole = resolveRoleFromClaims(resolvedClaims);
    let resolvedProfile: AppUserProfile | null = null;

    setClaims(resolvedClaims);
    setMembershipPlan(resolvedMembershipPlan);
    setRole(resolvedRole);
    setUser(sessionUser);

    try {
      await saveUserProfile(sessionUser);
      resolvedProfile = await fetchUserProfile(sessionUser.uid);
    } catch (error) {
      console.warn('Failed to load user profile.', error);
    }

    setProfile(resolvedProfile);

    return resolvedRole;
  }, []);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (sessionUser) => {
      setIsLoading(true);

      try {
        await loadSession(sessionUser);
      } finally {
        setIsLoading(false);
      }
    });
  }, [loadSession]);

  const signIn = useCallback(async (form: EmailAuthForm) => {
    const credential = await loginWithEmail(form);
    const signedInRole = (await loadSession(credential.user, true)) ?? 'user';

    void recordActivity({
      displayName: credential.user.displayName,
      email: credential.user.email,
      role: signedInRole,
      uid: credential.user.uid,
    }, {
      action: 'auth.login',
      summary: '계정에 로그인했습니다.',
    }).catch((error) => console.warn('Failed to record sign-in activity.', error));

    return signedInRole;
  }, [loadSession]);

  const signUp = useCallback(async (form: SignupForm) => {
    isCreatingAccountRef.current = true;

    try {
      await registerWithEmail(form);
      await logout();
      await loadSession(null);
    } finally {
      isCreatingAccountRef.current = false;
    }
  }, [loadSession]);

  const signOut = useCallback(async () => {
    if (user) {
      try {
        await recordActivity({
          displayName: user.displayName,
          email: user.email,
          role,
          uid: user.uid,
        }, {
          action: 'auth.logout',
          summary: '계정에서 로그아웃했습니다.',
        });
      } catch (error) {
        console.warn('Failed to record sign-out activity.', error);
      }
    }

    await logout();
    await loadSession(null);
  }, [loadSession, role, user]);

  const resendVerification = useCallback(async (form: EmailAuthForm) => {
    await resendVerificationEmail(form);
    await loadSession(null);
  }, [loadSession]);

  const refreshSession = useCallback(async () => {
    await loadSession(user, true);
  }, [loadSession, user]);

  const value = useMemo<AuthContextValue>(() => ({
    canUseProContent: membershipPlan === 'pro' || hasRoleAtLeast(role, 'admin'),
    claims,
    firebaseReady: isFirebaseConfigured,
    hasRole: (requiredRole) => hasRoleAtLeast(role, requiredRole),
    isAdmin: hasRoleAtLeast(role, 'admin'),
    isAuthenticated: Boolean(user),
    isLoading,
    membershipPlan,
    missingConfigKeys: missingFirebaseConfigKeys,
    profile,
    refreshSession,
    resendVerification,
    role,
    signIn,
    signOut,
    signUp,
    user,
  }), [claims, isLoading, membershipPlan, profile, refreshSession, resendVerification, role, signIn, signOut, signUp, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
