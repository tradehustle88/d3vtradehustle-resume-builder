// src/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if config is valid and we're in the browser
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

// Safe initialization function
function initializeFirebase() {
  // Check if we're in a browser environment and have a valid config
  if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
    try {
      // Initialize Firebase only if it hasn't been initialized yet
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      auth = getAuth(app);
      db = getFirestore(app);
      return { app, auth, db };
    } catch (error) {
      console.warn("Firebase initialization failed:", error);
      return null;
    }
  }
  return null;
}

// Lazy initialization
function getFirebaseServices() {
  if (!auth || !db) {
    const services = initializeFirebase();
    if (!services) {
      throw new Error("Firebase not available");
    }
    auth = services.auth;
    db = services.db;
  }
  return { auth, db };
}

// Google Sign-In Provider
let googleProvider: GoogleAuthProvider;

function getGoogleProvider() {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  }
  return googleProvider;
}

// Authentication Functions
export const signInWithGoogle = async (): Promise<User> => {
  const { auth } = getFirebaseServices();
  const provider = getGoogleProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const signUpWithEmailPassword = async (email: string, password: string): Promise<User> => {
  const { auth } = getFirebaseServices();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const signInWithEmailPassword = async (email: string, password: string): Promise<User> => {
  const { auth } = getFirebaseServices();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Get ID Token for API calls
export const getIdToken = async (): Promise<string | null> => {
  try {
    const { auth } = getFirebaseServices();
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.warn("Failed to get ID token:", error);
    return null;
  }
};

// Safe auth getter
export const getFirebaseAuth = (): Auth | undefined => {
  return auth;
};

// Export auth for components that need direct access
export { auth, db };

export default app;
