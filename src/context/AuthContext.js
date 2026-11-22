import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setInitializing(false);

      if (!currentUser) {
        setProfile(null);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, 'users', currentUser.uid));
        // right after register the document may not be saved yet
        if (snapshot.exists()) {
          const data = snapshot.data();
          setProfile({ name: data.name, phone: data.phone, email: data.email });
        }
      } catch (error) {
        console.log('Could not load profile', error);
      }
    });

    return unsubscribe;
  }, []);

  const register = async (name, phone, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      phone,
      email,
      createdAt: serverTimestamp(),
    });
    setProfile({ name, phone, email });
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
