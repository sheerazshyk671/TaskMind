// This file is deprecated in favor of the standardized initialization in src/firebase/index.ts
// It is kept temporarily for backward compatibility if needed, but should be removed once migration is complete.
import { initializeFirebase } from '@/firebase';

const services = typeof window !== 'undefined' ? initializeFirebase() : null;

export const auth = services?.auth;
export const db = services?.firestore;
export const googleProvider = null; // Use local provider creation in hooks
