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
import {
  fetchUserProfile,
  loginWithEmail,
  logout,
  registerWithEmail,
  saveUserProfile,
  type EmailAuthForm,
  type SignupForm,
} from '../services/authService';
import {
  hasRoleAtLeast,
  isUserRole,
  type AppUserProfile,
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
  missingConfigKeys: readonly string[];
  profile: AppUserProfile | null;
  refreshSession: () => Promise<void>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<AuthClaims>({});
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [user, setUser] = useState<User | null>(null);
  const isCreatingAccountRef = useRef(false);

  const loadSession = useCallback(async (sessionUser: User | null, forceRefresh = false) => {
    if (!sessionUser) {
      setClaims({});
      setProfile(null);
      setRole('user');
      setUser(null);
      return null;
    }

    if (usesPasswordProvider(sessionUser)) {
      await reload(sessionUser);

      if (!sessionUser.emailVerified) {
        setClaims({});
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
    const resolvedRole = resolveRoleFromClaims(resolvedClaims);
    let resolvedProfile: AppUserProfile | null = null;

    setClaims(resolvedClaims);
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
    return (await loadSession(credential.user, true)) ?? 'user';
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
    await logout();
    await loadSession(null);
  }, [loadSession]);

  const refreshSession = useCallback(async () => {
    await loadSession(user, true);
  }, [loadSession, user]);

  const value = useMemo<AuthContextValue>(() => ({
    claims,
    firebaseReady: isFirebaseConfigured,
    hasRole: (requiredRole) => hasRoleAtLeast(role, requiredRole),
    isAdmin: hasRoleAtLeast(role, 'admin'),
    isAuthenticated: Boolean(user),
    isLoading,
    missingConfigKeys: missingFirebaseConfigKeys,
    profile,
    refreshSession,
    role,
    signIn,
    signOut,
    signUp,
    user,
  }), [claims, isLoading, profile, refreshSession, role, signIn, signOut, signUp, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
