import process from 'node:process';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { existsSync, readFileSync } from 'node:fs';

const validRoles = new Set(['user', 'editor', 'manager', 'admin', 'owner']);
const [email, role] = process.argv.slice(2);
const rolePermissions = {
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

if (!email || !role || !validRoles.has(role)) {
  console.error('Usage: npm run set-role -- user@example.com admin');
  console.error('Roles: user, editor, manager, admin, owner');
  process.exit(1);
}

function getCredential() {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 'service-account.json';

  if (!existsSync(serviceAccountPath)) {
    return applicationDefault();
  }

  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  return cert(serviceAccount);
}

function getProjectId() {
  if (process.env.GOOGLE_CLOUD_PROJECT) {
    return process.env.GOOGLE_CLOUD_PROJECT;
  }

  if (process.env.GCLOUD_PROJECT) {
    return process.env.GCLOUD_PROJECT;
  }

  if (process.env.FIREBASE_CONFIG) {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    if (typeof firebaseConfig.projectId === 'string') {
      return firebaseConfig.projectId;
    }
  }

  if (existsSync('.firebaserc')) {
    const firebaseRc = JSON.parse(readFileSync('.firebaserc', 'utf8'));
    const defaultProject = firebaseRc.projects?.default;

    if (typeof defaultProject === 'string') {
      return defaultProject;
    }
  }

  return undefined;
}

initializeApp({
  credential: getCredential(),
  projectId: getProjectId(),
});

const auth = getAuth();
const firestore = getFirestore();
const user = await auth.getUserByEmail(email);
const existingClaims = user.customClaims ?? {};
const customClaims = {
  ...existingClaims,
  admin: role === 'admin' || role === 'owner',
  role,
};

await auth.setCustomUserClaims(user.uid, customClaims);
await firestore.doc(`users/${user.uid}`).set(
  {
    displayName: user.displayName ?? null,
    email: user.email ?? email,
    permissions: rolePermissions[role],
    role,
    uid: user.uid,
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true },
);

console.log(`Updated ${email} (${user.uid}) to role "${role}".`);
console.log('Ask the user to sign in again or refresh their ID token.');
