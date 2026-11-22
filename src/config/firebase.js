import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAapolwZoQD3fTKJWfMvCUdWuoI17Eal2o',
  authDomain: 'magic-cuts.firebaseapp.com',
  projectId: 'magic-cuts',
  storageBucket: 'magic-cuts.firebasestorage.app',
  messagingSenderId: '72914690327',
  appId: '1:72914690327:web:f4beb825cade105c341752',
};

const app = initializeApp(firebaseConfig);

// keeps the user signed in after the app is closed
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
