import { db } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Get petition name from URL
const urlParams = new URLSearchParams(window.location.search);
const petitionTitle = urlParams.get("petition");

// Load petition details
async function loadPetitionDetails() {
    if (!petitionTitle) {
        document.getElementById("petition-title").textContent = "Invalid Petition!";
        return;
    }

    const petitionRef = doc(db, "petitions", petitionTitle);
    const petitionSnap = await getDoc(petitionRef);

    if (petitionSnap.exists()) {
        document.getElementById("petition-title").textContent = petitionSnap.data().title;        
        const supporters = petitionSnap.data().supporters || [];
        document.getElementById("supporters-count").textContent = `Supporters: ${supporters.length}`;

    } else {
        document.getElementById("petition-title").textContent = "Petition Not Found!";
    }
}

// Handle signing petition
document.getElementById("petition-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!firstName || !lastName || !email) {
        document.getElementById("info-overlay").style.display="block";
        document.querySelector(".info").style.display="block";
        document.getElementById("infoholder").innerText="Please fill all the fields";
        return;
    }

    const petitionRef = doc(db, "petitions", petitionTitle);

    try {
        await updateDoc(petitionRef, {
            supporters: arrayUnion({ firstName, lastName, email })
        });

        // Fetch the updated document to update count
        const updatedSnap = await getDoc(petitionRef);
        const updatedSupporters = updatedSnap.data().supporters || [];
        document.getElementById("supporters-count").textContent = `Supporters: ${updatedSupporters.length}`;

        document.getElementById("info-overlay").style.display="block";
        document.querySelector(".info").style.display="block";
        document.getElementById("infoholder").innerText="Successfully signed the petition!";
        //alert("Successfully signed the petition!");
        document.getElementById("ok").addEventListener("click",function(){
            document.querySelector(".info").style.display="none";
            document.getElementById("info-overlay").style.display="none";
    });

        // Reload petition details to update supporters count
        loadPetitionDetails();

        // Reset the form
        document.getElementById("petition-form").reset();

    } catch (error) {
        console.error("Error signing petition:", error);
        alert("Failed to sign petition. Please try again.");
    }
});


// Load petition details on page load
loadPetitionDetails();
