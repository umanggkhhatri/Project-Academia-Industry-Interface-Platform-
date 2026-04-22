import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// NOTE: Firestore (getFirestore) has been removed — data storage is now handled by MongoDB.
// Firebase Auth is retained for authentication (login/logout).

const firebaseConfig = {
  apiKey: "AIzaSyBweD28Z5hiSEWptYNAMP_RNyC4jPn7O5A",
  authDomain: "prashikshan-fe1d3.firebaseapp.com",
  projectId: "prashikshan-fe1d3",
  storageBucket: "prashikshan-fe1d3.firebasestorage.app",
  messagingSenderId: "526283178083",
  appId: "1:526283178083:web:8a06081497dff87cdbf856",
  measurementId: "G-25Z579667M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };