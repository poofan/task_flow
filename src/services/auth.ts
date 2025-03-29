import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { User } from '../types';

export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return {
    id: userCredential.user.uid,
    email: userCredential.user.email || '',
    displayName: userCredential.user.displayName || '',
    photoURL: userCredential.user.photoURL || undefined
  };
};

export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return {
    id: userCredential.user.uid,
    email: userCredential.user.email || '',
    displayName: userCredential.user.displayName || '',
    photoURL: userCredential.user.photoURL || undefined
  };
};

export const register = async (email: string, password: string, displayName: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return {
    id: userCredential.user.uid,
    email: userCredential.user.email || '',
    displayName,
    photoURL: userCredential.user.photoURL || undefined
  };
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      unsubscribe();
      if (firebaseUser) {
        resolve({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || undefined
        });
      } else {
        resolve(null);
      }
    });
  });
}; 