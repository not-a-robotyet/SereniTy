import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async function () {
    const petitionsContainer = document.getElementById("petitions-container");
    petitionsContainer.innerHTML = "";
    const popupContainer = document.getElementById("popup");

    try {
        const querySnapshot = await getDocs(collection(db, "petitions"));

        querySnapshot.forEach((doc) => {
            const petition = doc.data();
            const petitionElement = document.createElement("div");
            petitionElement.classList.add("petition");
            petitionElement.style.backgroundColor = "#a8c6a8";
            petitionElement.innerHTML = `
                <img src="${petition.image}" alt="Petition Image">
                <h2>${petition.title}</h2>
            `;

            petitionElement.addEventListener("click", function () {
                openPopup(petition);
            });

            petitionsContainer.appendChild(petitionElement);
            popupContainer.addEventListener("click",function(){
                closePopup();
            });
        });
    } catch (error) {
        console.error("Error fetching petitions:", error);
    }
});

// Open Popup
function openPopup(petition) {
    document.getElementById("popup-title").textContent = petition.title;
    document.getElementById("popup-description").textContent = petition.description;
    document.getElementById("popup-author").textContent = "👤 " + petition.author;
    document.getElementById("popup-supporters").textContent = "👥 " + (petition.supporters ? petition.supporters.length || 0 : 0);
    document.getElementById("popup-date").textContent = "📅 " + petition.date;
    document.getElementById("popup-image").src = petition.image;
    document.getElementById("sign-petition-btn").href = `sign-petition.html?petition=${encodeURIComponent(petition.title)}`;
    document.getElementById("popup").style.display = "flex";
}

// Close Popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}