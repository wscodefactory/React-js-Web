import process from 'node:process';
import { existsSync, readFileSync } from 'node:fs';
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const validMembershipPlans = new Set(['free', 'pro']);
const [email, membershipPlan] = process.argv.slice(2);

if (!email || !membershipPlan || !validMembershipPlans.has(membershipPlan)) {
  console.error('Usage: npm run set-membership -- user@example.com pro');
  console.error('Membership plans: free, pro');
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
const customClaims = {
  ...(user.customClaims ?? {}),
  membershipPlan,
};

await auth.setCustomUserClaims(user.uid, customClaims);
await firestore.doc(`users/${user.uid}`).set(
  {
    displayName: user.displayName ?? null,
    email: user.email ?? email,
    membershipPlan,
    uid: user.uid,
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true },
);

console.log(`Updated ${email} (${user.uid}) to membership plan "${membershipPlan}".`);
console.log('Ask the user to sign in again or refresh their ID token.');
