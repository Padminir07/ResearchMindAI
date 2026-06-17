import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDd0wtaXin2rTuXrFVp6rtNLlG0d7qCR2s",
  authDomain: "researchmindai.firebaseapp.com",
  projectId: "researchmindai",
  storageBucket: "researchmindai.firebasestorage.app",
  messagingSenderId:"566150700906",
  appId: "1:566150700906:web:8bebe4d3ae5efc5beecf13",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();