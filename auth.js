import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";


const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
    const userEmailElement = document.getElementById("user-email");

    if (!userEmailElement) {
        console.error("Error: #user-email element not found.");
        return;
    }


    onAuthStateChanged(auth, (user) => {
        if (user) {
            userEmailElement.textContent = user.email;
        } else {
            window.location.href = "login.html";
        }
    });

    window.logout = function () {
        signOut(auth)
            .then(() => {
                //alert("Logged out successfully!");
                window.location.href = "login.html";
            })
            .catch((error) => {
                alert("Error logging out: " + error.message);
            });
    };
});
//window.logout=logout;