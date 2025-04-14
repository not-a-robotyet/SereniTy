// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBvf3G89Vq2K22Jvbtvl1njkJeXqKEEg8",
    authDomain: "serenity-2fca0.firebaseapp.com",
    projectId: "serenity-2fca0",
    storageBucket: "serenity-2fca0.appspot.com",
    messagingSenderId: "565500043700",
    appId: "1:565500043700:web:420449d6bb5bd2e32692e1",
    measurementId: "G-EQ24E823BB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Wait for the DOM to load before adding event listeners
document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup");
    const infoDiv = document.querySelector(".info");
    const infoHolder = document.getElementById("infoholder");
    const okButton = document.getElementById("ok");
    const infoOverlay = document.getElementById("info-overlay");

    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent page reload

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (!email || !password) {
                infoOverlay.style.display = "block";
                infoHolder.innerText = "Please enter both email and password.";
                infoDiv.style.display = "block"; // Show popup
                return;
                
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    infoOverlay.style.display = "block";
                    infoHolder.innerText ="User created successfully! 🎉";
                    infoDiv.style.display = "block";
                    signupForm.reset(); // Clear form fields after successful signup
                })
                .catch((error) => {
                    infoOverlay.style.display = "block";
                    infoHolder.innerText = error.message;
                    infoDiv.style.display = "block";
                });
        });
    }

    if (okButton) {
        okButton.addEventListener("click", function () {
            infoDiv.style.display = "none"; // Hide popup
            infoOverlay.style.display = "none";
        });
    }

});