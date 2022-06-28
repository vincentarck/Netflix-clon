import { create } from "domain";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { useRouter } from "next/router";
import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth } from "../firebase";

interface IAuth {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  logOut: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<IAuth>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  logOut: async () => {},
  loading: false,
  error: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          setLoading(false);
        } else {
          setUser(null);
          setLoading(true);
          router.push("/login");
        }
        setInitialLoading(false);
      }),
    [auth]
  );
  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        setUser(userCredentials.user);
        router.push("/");
        setLoading(false);
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
    auth.currentUser !== null &&
      (await updateProfile(auth.currentUser, { displayName: username }).catch(
        (err) => console.log(err)
      ));
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        setUser(user.user);
        router.push("/");
        setLoading(false);
      })
      .catch((error) => {
        router.push("/error");
      })
      .finally(() => setLoading(false));
  };

  const logOut = async () => {
    setLoading(true);
    await signOut(auth)
      .then(() => {
        setUser(null);
        router.push("/login");
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  };

  const memoized = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      logOut,
      error,
    }),
    [user, loading]
  );
  return (
    <AuthContext.Provider value={memoized}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
