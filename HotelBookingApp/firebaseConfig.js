import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDgakA5-VTK3t9w0pYlCK6U1revqdshYLU",
  authDomain: "hotelbookingapp-5779e.firebaseapp.com",
  projectId: "hotelbookingapp-5779e",
  storageBucket: "hotelbookingapp-5779e.firebasestorage.app",
  messagingSenderId: "331176088267",
  appId: "1:331176088267:web:fdde46de55e5ec5b71c14e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);