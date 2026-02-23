
"use client"

import { useUser, useAuth as useFirebaseAuth } from '@/firebase';
import { signInWithPopup, signOut, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const { user, isUserLoading: loading, userError } = useUser();
  const auth = useFirebaseAuth();
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      
      let errorMessage = "An unexpected error occurred during sign-in.";
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Google Sign-In is not enabled for this project. Please enable it in the Firebase Console.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in popup was closed before completion.";
      }

      toast({
        variant: "destructive",
        title: "Sign-in Failed",
        description: errorMessage,
      });
    }
  };

  const signInGuest = async () => {
    try {
      await signInAnonymously(auth);
      toast({
        title: "Welcome to the Demo!",
        description: "You're exploring TaskPilot as a guest. Your tasks will be saved for this session.",
      });
    } catch (error: any) {
      console.error("Error signing in as guest", error);
      toast({
        variant: "destructive",
        title: "Demo Failed",
        description: "Guest access is currently unavailable. Please try Google sign-in.",
      });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not sign out. Please try again.",
      });
    }
  };

  return { 
    user, 
    loading, 
    signInWithGoogle, 
    signInGuest,
    logout,
    error: userError 
  };
}
