import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const userEmailElement = document.getElementById("user-email");
    const logoutButton = document.getElementById("logout-btn");

    if (!userEmailElement || !logoutButton) {
        console.error("Error: Required elements not found.");
        return;
    }

    // Handle authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userEmailElement.textContent = user.email;
        } else {
            window.location.href = "login.html";
        }
    });

    // Logout function
    logoutButton.addEventListener("click", () => {
        signOut(auth)
            .then(() => {
                window.location.href = "login.html";
            })
            .catch((error) => {
                alert("Error logging out: " + error.message);
            });
    });

    window.navigateBrowse = function(){
        window.location.href = "browse.html";
    }

});


