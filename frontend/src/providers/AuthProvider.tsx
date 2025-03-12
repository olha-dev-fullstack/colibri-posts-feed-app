import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase/firebase";
import { DbUser } from "../interface/user.interface";

interface AuthContextType {
  user: User | null;
  dbUser: DbUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const response = await axios.get<DbUser>(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${await user!.getIdToken()}` },
    });
    return response?.data;
  };

  const { data, isLoading: isUserLoading } = useQuery({
    queryKey: ["getUserFromDb"],
    queryFn: () => fetchUser(),
    enabled: !!user,
  });

  useEffect(() => {
    if (isUserLoading) return;
    setDbUser(data!);
  }, [data, isUserLoading]);
  // add dbUser type and add to provider

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredentials.user, {
      displayName: username,
    });
    await sendEmailVerification(userCredentials.user);
    window.location.replace("/feed");
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.replace("/feed");
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    window.location.replace("/feed");
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        isLoading,
        signUp,
        signIn,
        signInWithGoogle,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
