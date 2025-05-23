// src/lib/firebaseConfig.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

// Estas são as credenciais que você forneceu.
// ATENÇÃO: ISTO É PARA DEPURAÇÃO. NÃO FAÇA COMMIT DE CHAVES REAIS PARA O GITHUB.
const firebaseCredentials = {
  apiKey: "AIzaSyCvQCQbE1W3rmRJY_s1Bs40z7qDb0QZQcA",
  authDomain: "amigosfitnessapp.firebaseapp.com",
  projectId: "amigosfitnessapp",
  storageBucket: "amigosfitnessapp.appspot.com", // Corrigido de firebasestorage.app para appspot.com
  messagingSenderId: "1006839428846",
  appId: "1:1006839428846:web:e8e44c64289576570725ff"
  // measurementId: "SEU_MEASUREMENT_ID_AQUI" // Adicione se você tiver e precisar
};

console.log('[FirebaseConfig] ATTEMPTING TO USE HARDCODED CREDENTIALS FOR DEBUGGING:');
console.log('[FirebaseConfig] Hardcoded apiKey:', firebaseCredentials.apiKey ? 'DEFINED' : 'UNDEFINED');
console.log('[FirebaseConfig] Hardcoded authDomain:', firebaseCredentials.authDomain);
console.log('[FirebaseConfig] Hardcoded projectId:', firebaseCredentials.projectId);

if (!firebaseCredentials.apiKey || !firebaseCredentials.projectId) {
  console.error(
    "[FirebaseConfig] CRITICAL ERROR (HARDCODED): apiKey or projectId is missing from hardcoded credentials. Firebase will fail."
  );
  // Lançar um erro aqui pode ser útil para interromper a execução se as credenciais essenciais estiverem faltando
  // throw new Error("Critical Firebase configuration (apiKey or projectId) is missing in firebaseConfig.ts with hardcoded values.");
}

const firebaseConfig = {
  apiKey: firebaseCredentials.apiKey,
  authDomain: firebaseCredentials.authDomain,
  projectId: firebaseCredentials.projectId,
  storageBucket: firebaseCredentials.storageBucket,
  messagingSenderId: firebaseCredentials.messagingSenderId,
  appId: firebaseCredentials.appId,
  // measurementId: firebaseCredentials.measurementId, // Descomente se você tiver e precisar
};

// Initialize Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('[FirebaseConfig] Firebase App Inicializado com sucesso (com credenciais hardcoded).');
  } catch (e) {
    console.error('[FirebaseConfig] ERRO CRÍTICO AO INICIALIZAR Firebase App com credenciais hardcoded:', e);
    // Lançar o erro pode ser uma boa ideia para parar a execução se a inicialização falhar.
    // throw e; 
    // Para evitar que o app quebre totalmente em alguns cenários de SSR,
    // podemos definir 'app' como uma casca vazia ou lidar com isso de outra forma,
    // mas o ideal é que a inicialização não falhe.
    // Por agora, se falhar, as próximas chamadas para getFirestore/getAuth falharão.
    app = {} as FirebaseApp; // Placeholder para evitar quebrar o build imediatamente, mas o erro já ocorreu.
  }
} else {
  app = getApps()[0]; // Use the existing app if already initialized
  console.log('[FirebaseConfig] Firebase App já inicializado, usando instância existente.');
}

// Initialize Firestore
let db: Firestore;
try {
  db = getFirestore(app);
  console.log('[FirebaseConfig] Firestore inicializado com sucesso.');
} catch (e) {
  console.error('[FirebaseConfig] ERRO AO INICIALIZAR Firestore:', e);
  db = {} as Firestore; // Placeholder
}

// Initialize Firebase Authentication
let auth: Auth;
try {
  auth = getAuth(app);
  console.log('[FirebaseConfig] Firebase Auth inicializado com sucesso.');
} catch (e) {
  console.error('[FirebaseConfig] ERRO AO INICIALIZAR Firebase Auth:', e);
  auth = {} as Auth; // Placeholder
}

// Export the instances to be used in other parts of the app
export { app, db, auth };
