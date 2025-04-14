import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDBvf3G89Vq2K22Jvbtvl1njkJeXqKEEg8",
    authDomain: "serenity-2fca0.firebaseapp.com",
    projectId: "serenity-2fca0",
    storageBucket: "serenity-2fca0.appspot.com",
    messagingSenderId: "565500043700",
    appId: "1:565500043700:web:420449d6bb5bd2e32692e1",
    measurementId: "G-EQ24E823BB"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;

export { app, auth, db, firebaseConfig };