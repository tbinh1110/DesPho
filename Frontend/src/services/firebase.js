// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyByws7Tvc9awP8Bnf0lo3VxLqEflCc5TyM",
    authDomain: "despho-c2ecf.firebaseapp.com",
    projectId: "despho-c2ecf",
    storageBucket: "despho-c2ecf.firebasestorage.app",
    messagingSenderId: "826654731797",
    appId: "1:826654731797:web:ca9ab3595be38077b5e81c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

auth.settings.appVerificationDisabledForTesting = false;