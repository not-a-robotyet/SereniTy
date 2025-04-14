import { auth } from "./firebaseConfig.js";
import { 
    setPersistence, 
    browserSessionPersistence, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// ✅ Ensure session is per-tab before login
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log("✅ Session is now per-tab.");
    })
    .catch((error) => {
        console.error("❌ Error setting persistence:", error);
    });

// ✅ Login Function
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form refresh
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const infoDiv = document.querySelector(".info");
    const infoHolder = document.getElementById("infoholder");
    const okButton = document.getElementById("ok");
    const infoOverlay = document.getElementById("info-overlay");

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ User logged in:", userCredential.user);
        window.location.href = "home.html"; // Redirect to home page after login
    } catch (error) {
        console.error("❌ Login error:", error.message);
        infoOverlay.style.display = "block";
        infoHolder.innerText = "Login failed. Check your credentials.";
        infoDiv.style.display = "block";
        

    }

    if (okButton) {
        okButton.addEventListener("click", function () {
            infoDiv.style.display = "none"; // Hide popup
            infoOverlay.style.display = "none";
        });
    }
});

// ✅ Monitor Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("✅ User is logged in:", user.email);
    } else {
        console.log("❌ No user logged in");
    }
});