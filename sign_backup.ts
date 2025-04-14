// Get petition name from URL
const urlParams = new URLSearchParams(window.location.search);
const petitionTitle = urlParams.get("petition");

// Load petition details
async function loadPetitionName() {
    if (petitionTitle) {
        document.getElementById("petition-title").textContent = petitionTitle;
        
        // Simulate fetching petition details (no Firestore)
        // Set initial supporters count to a placeholder
        document.getElementById("supporters-count").textContent = "Supporters: 0";
    } else {
        document.getElementById("petition-title").textContent = "Invalid Petition!";
    }
}

// Handle signing petition
document.getElementById("petition-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!firstName || !lastName || !email) {
        alert("Please fill all fields before signing.");
        return;
    }

    // Simulate updating supporters count (no Firestore)
    const currentSupporters = parseInt(document.getElementById("supporters-count").textContent.split(":")[1].trim()) || 0;
    const updatedSupporters = currentSupporters + 1;

    // Simulate signing the petition and updating the supporters count
    alert("Successfully signed the petition!");

    // Update the supporters count displayed on the page
    document.getElementById("supporters-count").textContent = `Supporters:${updatedSupporters}`;

    // Show success message
    const successMessage = document.createElement("p");
    successMessage.textContent = "Petition signed successfully!";
    successMessage.style.color = "green";
    document.body.appendChild(successMessage);

    // Reset the form
    document.getElementById("petition-form").reset();
});

// Load petition name on page load
loadPetitionName();