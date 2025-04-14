import { db } from "./firebaseConfig.js";
import { auth } from "./firebaseConfig.js";
import { 
  setPersistence, 
  browserSessionPersistence, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { 
  collection, addDoc, updateDoc, doc, orderBy, query, getDoc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// ✅ *Ensure session is per-tab*
setPersistence(auth, browserSessionPersistence)
    .then(() => console.log("✅ Session is now per-tab."))
    .catch((error) => console.error("❌ Error setting persistence:", error));

// ✅ *Run script only when DOM is loaded*
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    // Get references to UI elements
    const submitStoryBtn = document.getElementById("submitStoryBtn");
    const formModal = document.getElementById("formModal");
    const alertModal = document.getElementById("alertModal");
    const closeModal = document.getElementById("closeModal");
    const closeAlert = document.getElementById("closeAlert");
    const submitStory = document.getElementById("submitStory");
    const storyText = document.getElementById("storyText");
    const wallContainer = document.getElementById("wall-container");
    const charCount = document.getElementById("charCount");

    if (!submitStoryBtn || !formModal || !closeModal) {
      console.error("❌ One or more elements not found!");
      return;
    }

    let currentUserId = null; // 🔹 Store the current user's ID

    // ✅ *Check Authentication State*
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("🔹 User logged in:", user.uid);
            currentUserId = user.uid; // ✅ Store authenticated user's ID
            fetchStories(); // 🔄 Fetch stories after authentication
        } else {
            console.log("❌ No user logged in");
            currentUserId = null; // Reset user ID if logged out
        }
    });

    // 📌 Character counter
    storyText.addEventListener("input", () => {
      charCount.textContent = `${storyText.value.length}/680 characters`;
    });

    // 📌 Open modal on button click
    submitStoryBtn.addEventListener("click", () => {
      console.log("📢 Submit button clicked!");
      formModal.style.display = "flex";
    });

    // 📌 Close modals
    closeModal.addEventListener("click", () => {
      formModal.style.display = "none";
    });

    closeAlert.addEventListener("click", () => {
      alertModal.style.display = "none";
    });

    // ✅ *Submit Story to Firestore*
    submitStory.addEventListener("click", async () => {
        console.log("📢 Submit button clicked!");

        const text = storyText.value.trim();
        console.log("📝 Story Text:", text);

        if (!text || !currentUserId) {
            console.log("❌ Story text is empty or user not logged in!");
            alertModal.style.display = "flex";
            return;
        }

        try {
            await addDoc(collection(db, "stories"), {
                userId: currentUserId,
                text,
                likes: 0,
                likedBy: {},
            });

            console.log("✅ Story successfully added!");
            formModal.style.display = "none";
            storyText.value = "";
            charCount.textContent = "0/680 characters";
        } catch (error) {
            console.error("❌ Error adding story:", error);
        }
    });

    // ✅ *Fetch Stories in Real-Time*
    function fetchStories() {
        const storiesRef = collection(db, "stories");
        const q = query(storiesRef, orderBy("likes", "desc"));

        // 🔄 *Real-time listener*
        onSnapshot(q, (snapshot) => {
            wallContainer.innerHTML = ""; // Clear wall before updating

            snapshot.forEach((docSnap) => {
                const story = docSnap.data();
                displayStory(docSnap.id, story);
            });

            console.log("🔄 Real-time update received!");
        });
    }
    const stickyNoteColors = [
        "#FFEB3B", "#FFCDD2", "#C8E6C9", "#BBDEFB", 
        "#FFAB91", "#E1BEE7", "#85ffe3", "#F8BBD0"
    ];
    let colorIndex = 0;
    
    // ✅ *Display a Story on the Wall*
    function displayStory(storyId, story) {
        const noteWrapper = document.createElement("div");
        noteWrapper.classList.add("note-wrapper");

        const stickyNote = document.createElement("div");
        stickyNote.classList.add("sticky-note");
        
        stickyNote.style.backgroundColor = stickyNoteColors[colorIndex];
        colorIndex = (colorIndex + 1) % stickyNoteColors.length;


        const noteContent = document.createElement("div");
        noteContent.classList.add("note-content");
        noteContent.textContent = story.text;
        stickyNote.appendChild(noteContent);

        const likeContainer = document.createElement("div");
        likeContainer.classList.add("like-container");

        const likeButton = document.createElement("button");
        likeButton.classList.add("like-button");

        // 🔹 Ensure story.likedBy exists to prevent errors
        const userLiked = story.likedBy && story.likedBy[currentUserId];
        likeButton.textContent = userLiked ? "❤" : "🤍";

        const likeCount = document.createElement("span");
        likeCount.classList.add("like-count");
        likeCount.textContent = story.likes;

        likeContainer.appendChild(likeButton);
        likeContainer.appendChild(likeCount);
        noteWrapper.appendChild(stickyNote);
        noteWrapper.appendChild(likeContainer);
        wallContainer.appendChild(noteWrapper);

        // ✅ *Toggle Like*
        likeButton.addEventListener("click", async () => {
            if (!currentUserId) {
                console.error("❌ User not logged in, cannot like/unlike.");
                return;
            }

            const storyRef = doc(db, "stories", storyId);
            const liked = !!story.likedBy?.[currentUserId];

            try {
                // Get the latest data from Firestore
                const storySnap = await getDoc(storyRef);
                const storyData = storySnap.data();

                if (!storyData) return;

                let updatedLikes = storyData.likes || 0;
                let updatedLikedBy = storyData.likedBy || {};

                if (liked) {
                    // 🔻 User is unliking
                    delete updatedLikedBy[currentUserId];
                    updatedLikes = Math.max(0, updatedLikes - 1); // Ensure likes never go below 0
                } else {
                    // 🔺 User is liking
                    updatedLikedBy[currentUserId] = true;
                    updatedLikes += 1;
                }

                // 🔄 Update Firestore
                await updateDoc(storyRef, {
                    likedBy: updatedLikedBy,
                    likes: updatedLikes,
                });

            } catch (error) {
                console.error("❌ Error updating likes:", error);
            }
        });

        // ✅ *Expand Story*
        stickyNote.addEventListener("click", () => {
            const isExpanded = stickyNote.classList.contains("expanded");

            // Reset all notes to original size
            document.querySelectorAll(".sticky-note").forEach((note) => {
                note.style.width = "220px";
                note.style.height = "220px";
                note.classList.remove("expanded"); // Remove expanded class
            });

            if (!isExpanded) {
                // Expand only if it wasn't already expanded
                stickyNote.style.width = "350px";
                stickyNote.style.height = "350px";
                stickyNote.classList.add("expanded"); // Add expanded class
            }
        });
    }
});