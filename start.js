import { db } from "./firebaseConfig.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const auth = getAuth();
let currentUserEmail = "Anonymous"; // Default if user is not logged in

// Ensure user authentication is being tracked
onAuthStateChanged(auth, (user) => {
    if (user && user.email) {
        currentUserEmail = user.email; // ✅ Store user email globally
        console.log("User logged in:", currentUserEmail);
    } else {
        console.log("No user logged in.");
    }
});

// Listen for form submission
document.getElementById("petitionForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const scope = document.getElementById("selectedScope").value;
    const region = document.getElementById("region").value.trim();
    const date = document.getElementById("date").value;
    const image = document.getElementById("image").files[0] || null;

    if (!title || !description || !scope || !region) {
        document.getElementById("info-overlay").style.display="block";
        document.querySelector(".info").style.display="block";
        document.getElementById("infoholder").innerText="Please fill all the fields";
        return;
    }

    try {
        const newPetition = {
            title,
            description,
            scope,
            region,
            author: currentUserEmail, // ✅ Now uses globally stored user email
            date,
            image: image ? URL.createObjectURL(image) : "default.jpg",
            supporters: 0
        };

        await addDoc(collection(db, "petitions"), newPetition);
        document.getElementById("info-overlay").style.display="block";
        document.querySelector(".info").style.display="block";
        document.getElementById("infoholder").innerText="Petition successfully added!";
        //alert("Petition successfully added!");
        document.getElementById("ok").addEventListener("click",function(){
            document.querySelector(".info").style.display="none";
            document.getElementById("info-overlay").style.display="none";
            browseWindow();
        });
    
    
    } catch (error) {
        console.error("Error adding petition:", error);
        document.getElementById("info-overlay").style.display="block";
        document.querySelector(".info").style.display="block";
        document.getElementById("infoholder").innerText="Failed to submit petition. Try again.";
        //alert("Failed to submit petition. Try again.");
        document.getElementById("ok").addEventListener("click",function(){
            document.querySelector(".info").style.display="none";
            document.getElementById("info-overlay").style.display="none";
        });
    }
});

function browseWindow(){
    
    console.log("Redirecting to browse.html...");
    window.location.href = "browse.html";
};