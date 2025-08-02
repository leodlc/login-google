// src/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup // ✅ IMPORTAR AQUÍ
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAVM9znmGjBTfaT_9nIWCXdMj2b2ODYCV4",
  authDomain: "logisticone-64ec0.firebaseapp.com",
  databaseURL: "https://logisticone-64ec0-default-rtdb.firebaseio.com",
  projectId: "logisticone-64ec0",
  storageBucket: "logisticone-64ec0.appspot.com", // ⚠️ corregido .app → .com
  messagingSenderId: "203645913004",
  appId: "1:203645913004:web:db0eb544d614f18dff5c09"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

// Exportar los elementos necesarios
export { auth, provider, signInWithPopup, storage };
