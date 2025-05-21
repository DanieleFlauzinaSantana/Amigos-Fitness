// src/lib/firebaseConfig.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth"; // Adicionado Auth

// Sua configuração do Firebase, obtida do Console do Firebase
// SUBSTITUA PELOS SEUS VALORES REAIS SE FOREM DIFERENTES
const firebaseConfig = {
  apiKey: "AIzaSyCvQCQbE1W3rmRJY_s1Bs40z7qDb0QZQcA",
  authDomain: "amigosfitnessapp.firebaseapp.com",
  projectId: "amigosfitnessapp",
  storageBucket: "amigosfitnessapp.firebasestorage.app",
  messagingSenderId: "1006839428846",
  appId: "1:1006839428846:web:e8e44c64289576570725ff"
  // measurementId: "SEU_MEASUREMENT_ID_AQUI" // Opcional
};

// Inicializar o Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use o app existente se já foi inicializado
}

// Inicializar o Firestore
const db: Firestore = getFirestore(app);

// Inicializar o Firebase Authentication
const auth: Auth = getAuth(app); // Criada a instância de Auth

// Exportar as instâncias para serem usadas em outras partes do app
export { app, db, auth }; // Exportado auth
