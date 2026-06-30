/* =========================================
   SHHUTUP™ - FIREBASE SETUP (LOCAL DEV MODE)
   =========================================
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// अपने Firebase Console से मिली डिटेल्स यहाँ डालें
const firebaseConfig = {
  apiKey: "AIzaSyCwyEpDWgN96soXhAyiR4xwp3a4KDDYHXg",
  authDomain: "watch-83751.firebaseapp.com",
  databaseURL: "https://watch-83751-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "watch-83751",
  storageBucket: "watch-83751.firebasestorage.app",
  messagingSenderId: "992393681490",
  appId: "1:992393681490:web:feeea9f064ba5011e4dd8b"
};

let app, db;

export async function initFirebase() {
    try {
        app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        console.log("Firebase Initialized (Local Mode) 🚀");
        
        return { app, db };
    } catch (error) {
        console.error("Firebase Initialization Failed:", error);
    }
}

export { ref, push, set, get, child };