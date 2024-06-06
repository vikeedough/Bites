import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'
import { getAnalytics } from "firebase/analytics";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD1tl1lTlT-_Gp36QubFZ-qi4dcYHFQpBk",
  authDomain: "bites-e3f8d.firebaseapp.com",
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: "bites-e3f8d",
  storageBucket: "bites-e3f8d.appspot.com",
  messagingSenderId: "184829217373",
  appId: "1:184829217373:web:0785846b7bd55aebad1bb4",
  measurementId: "G-1MM7B2RTYX"
};

export const firebaseApp = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const firebaseDb = getFirestore(firebaseApp);
