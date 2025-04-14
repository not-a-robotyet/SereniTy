// Import Firebase modules
import { db, auth } from "./firebaseConfig.js";
import { 
    doc, getDoc, setDoc, updateDoc, increment, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { 
    onAuthStateChanged, setPersistence, browserSessionPersistence 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// ✅ Set session-based authentication persistence
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log("✅ Session persistence is now per tab (not shared across tabs).");
    })
    .catch((error) => {
        console.error("❌ Error setting session persistence:", error);
    });

// Function to update mood stats in Firestore
async function updateMoodStats(mood) {
    const user = auth.currentUser;
    if (!user) {
        document.getElementById("popup-message").innerText = "You must be logged in to vote!";
        showPopup();
        return;
    }

    try {
        const userDocRef = doc(db, "users", user.uid);
        const moodDocRef = doc(db, "moodTracker", "moods");

        // Check if the user can vote (1-hour restriction)
        const userDocSnap = await getDoc(userDocRef);
        const lastVoteTime = userDocSnap.exists() ? userDocSnap.data().lastVote?.toMillis() || 0 : 0;
        const now = Date.now();

        if (now - lastVoteTime < 3600000) {
            document.getElementById("popup-message").innerText = "You can only vote once per hour.";
            document.getElementById("popup-stats").innerText = "";
            showPopup();
            return;
        }

        // Store user's mood selection
        await setDoc(userDocRef, {
            mood: mood,
            lastVote: serverTimestamp()
        }, { merge: true });

        // Increment global mood count
        await updateDoc(moodDocRef, { [mood]: increment(1) });

        // Fetch the count for the selected mood and show popup
        showMoodPopup(mood);

    } catch (error) {
        console.error("Error updating mood stats:", error);
    }
}

// Function to fetch and display mood count in a modal popup
async function showMoodPopup(mood) {
    const moodDocRef = doc(db, "moodTracker", "moods");
    const docSnap = await getDoc(moodDocRef);
    
    let count = 0;
    if (docSnap.exists() && docSnap.data()[mood]) {
        count = docSnap.data()[mood];
    }

    // Update the modal with the mood count
    document.getElementById("popup-message").innerText = `You selected: ${mood}`;
    document.getElementById("popup-stats").innerText = `${count} people felt the same way!`;

    // Show the popup with overlay
    showPopup();
}

// Function to show the popup and overlay
function showPopup() { 
    document.getElementById("popup").style.display = "block";
    document.getElementById("popup-overlay").style.display = "block"; // Show overlay
}

// Function to close the popup and overlay
function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("popup-overlay").style.display = "none"; // Hide overlay
}

// ✅ Monitor Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(`🔹 Logged in as: ${user.email}`);
    } else {
        console.log("❌ No user logged in.");
    }
});

// ✅ Ensure the Close button and overlay work
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".mood-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const mood = button.dataset.mood;
            await updateMoodStats(mood);
        });
    });

    document.getElementById("popup-overlay").addEventListener("click", closePopup);
    document.querySelector("#popup button").addEventListener("click", closePopup); // Fix Close button click
});