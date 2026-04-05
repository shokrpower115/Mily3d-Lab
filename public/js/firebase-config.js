// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 CONFIG REAL
const firebaseConfig = {
  apiKey: "AIzaSyAHd-Sy6sBD9sdRjqTE_EaE0SfG3cmX8Kw",
  authDomain: "nfc-info.firebaseapp.com",
  projectId: "nfc-info",
  storageBucket: "nfc-info.appspot.com",
  messagingSenderId: "594217896934",
  appId: "1:594217896934:web:2ed80b2ad7b01010842427",
  measurementId: "G-W06B6KQZRF"
};

// 🚀 INICIALIZAR
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📤 EXPORTAR
export { db, app };