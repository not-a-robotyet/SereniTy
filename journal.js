import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { firebaseConfig } from "./firebaseConfig.js"; // Ensure firebaseConfig.js exports correctly

// ✅ Initialize Firebase App, Firestore, and Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
    const journalTitle = document.getElementById("journaltitle");
    const journalContent = document.getElementById("journalpage");
    const datePicker = document.getElementById("datepicker");
    const saveButton = document.getElementById("journalsave");
    let selectedColor = "white";
    let currentUser = null;

    // ✅ Ensure authentication is established before Firestore operations
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            console.log("✅ User logged in:", user.uid);
        } else {
            currentUser = null;
            console.log("❌ No user logged in.");
            alert("Please log in to use the journal feature.");
        }
    });

    // 🔹 Function to Save Journal Entry
    async function saveJournalEntry(userId, date, title, content, color) {
        if (!userId || !date) {
            alert("User or date is missing. Unable to save.");
            return;
        }

        try {
            const journalRef = doc(db, "journals", `${userId}_${date}`);
            const journalData = {
                userId: userId,
                date: date,
                title: title.trim(),
                content: content.trim(),
                color: color
            };

            console.log("📤 Attempting to save journal:", journalData);

            await setDoc(journalRef, journalData);

            console.log("✅ Journal saved successfully!");
            alert("Journal saved successfully!");
        } catch (error) {
            console.error("❌ Error saving journal:", error);
            alert("Failed to save journal. Check console for errors.");
        }
    }

    // 🔹 Function to Load Journal Entry
    async function loadJournalEntry(userId, date) {
        if (!userId || !date) return;

        try {
            const journalRef = doc(db, "journals", `${userId}_${date}`);
            const docSnap = await getDoc(journalRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                journalTitle.value = data.title;
                journalContent.value = data.content;
                selectedColor = data.color;
                changepagecolor(selectedColor);
                console.log("📄 Loaded journal:", data);
            } else {
                journalTitle.value = "";
                journalContent.value = "";
                changepagecolor("cornsilk");
                console.log("📭 No journal found for", date);
            }
        } catch (error) {
            console.error("❌ Error loading journal:", error);
        }
    }

    // 🔹 Event Listener for Date Selection
    datePicker.addEventListener("change", function () {
        const selectedDate = datePicker.value;
        document.getElementById("selected_date").innerText = selectedDate;

        if (currentUser) {
            loadJournalEntry(currentUser.uid, selectedDate);
        } else {
            alert("Please log in to view journal entries.");
        }
    });

    // 🔹 Event Listener for Save Button
    saveButton.addEventListener("click", async function (event) {
        event.preventDefault();
        const selectedDate = datePicker.value;

        if (!currentUser) {
            alert("❌ Please log in before saving.");
            return;
        }

        if (!selectedDate) {
            alert("❌ Please select a date before saving.");
            return;
        }

        await saveJournalEntry(currentUser.uid, selectedDate, journalTitle.value, journalContent.value, selectedColor);
    });

    // 🔹 Function to Change Background Color
    window.changepagecolor = function (color) {
        let focusBorderColor,focusBoxShadow,focusTitleBorderColor,focusTitleBoxShadow,buttonColorHoverEffect,buttonColorBackgroundEffect;
            {
                if(color=='cornsilk'){
                    document.getElementById("journaltitle").style.backgroundColor = "#fff8dc";
                    document.getElementById("selected_date").style.backgroundColor = "#fff8dc";
                    document.getElementById("journaltitle").style.border="2px solid #987654";
                    document.getElementById("selected_date").style.border="2px solid #987654";
                    document.getElementById("journaltitle").style.borderBottom="none";
                    document.getElementById("selected_date").style.borderBottom= "none";
                    document.getElementById("selected_date").style.borderLeft="none";
                    document.getElementById("journalpage").style.backgroundImage = "repeating-linear-gradient(#fff8dc 0px, #fff8dc 28px, #987654 29px, #fff8dc 30px)" ;
                    document.getElementById("journalpage").style.border="2px solid #987654" ;
                    applyfocusEffect("#987654","rgba(152, 118, 84, 0.5)");
                    applyfocusTitleEffect("#987654","rgba(152, 118, 84, 0.5)");
                    //changeimagecolor("#fff8dc","#987654");
                    buttonColorHoverEffect="#987654";
                    buttonColorBackgroundEffect="#fff8dc";
                }
                else if(color=='lightcyan'){
                    document.getElementById("journaltitle").style.backgroundColor = "#e0ffff";
                    document.getElementById("selected_date").style.backgroundColor = "#e0ffff";
                    document.getElementById("journaltitle").style.border="2px solid #87ceeb";
                    document.getElementById("selected_date").style.border="2px solid #87ceeb";
                    document.getElementById("journaltitle").style.borderBottom="none";
                    document.getElementById("selected_date").style.borderBottom= "none";
                    document.getElementById("selected_date").style.borderLeft="none";
                    document.getElementById("journalpage").style.backgroundImage = "repeating-linear-gradient(#e0ffff  0px, #e0ffff  28px, #87ceeb 29px, #e0ffff 30px)";
                    document.getElementById("journalpage").style.border="2px solid #87ceeb";
                    applyfocusEffect("#87ceeb","rgba(115, 169, 194, 0.5)");
                    applyfocusTitleEffect("#87ceeb","rgba(115, 169, 194, 0.5)");
                    //changeimagecolor("#e0ffff","#87ceeb");
                    buttonColorHoverEffect="#87ceeb";
                    buttonColorBackgroundEffect="#e0ffff";
                }
                else if(color=='nyanza'){
                    document.getElementById("journaltitle").style.backgroundColor= "#e9ffdb";
                    document.getElementById("selected_date").style.backgroundColor= "#e9ffdb";
                    document.getElementById("journaltitle").style.border="2px solid #addfad";
                    document.getElementById("selected_date").style.border="2px solid #addfad";
                    document.getElementById("journaltitle").style.borderBottom="none";
                    document.getElementById("selected_date").style.borderBottom= "none";
                    document.getElementById("selected_date").style.borderLeft="none";
                    document.getElementById("journalpage").style.backgroundImage = "repeating-linear-gradient(#e9ffdb 0px, #e9ffdb 28px, #addfad 29px, #e9ffdb 30px)";
                    document.getElementById("journalpage").style.border="2px solid #addfad";
                    applyfocusEffect("#addfad","rgba(216, 228, 188, 0.5)");
                    applyfocusTitleEffect("#addfad","rgba(216, 228, 188, 0.5)");
                   // changeimagecolor("#e9ffdb","#addfad");
                    buttonColorHoverEffect="#addfad";
                    buttonColorBackgroundEffect="#e9ffdb";
                }
                else if(color=='lavender'){
                    document.getElementById("journaltitle").style.backgroundColor = "#e6e6fa";
                    document.getElementById("selected_date").style.backgroundColor = "#e6e6fa";
                    document.getElementById("journaltitle").style.border="2px solid #966fd6";
                    document.getElementById("selected_date").style.border="2px solid #966fd6";
                    document.getElementById("journaltitle").style.borderBottom="none";
                    document.getElementById("selected_date").style.borderBottom= "none";
                    document.getElementById("selected_date").style.borderLeft="none";
                    document.getElementById("journalpage").style.backgroundImage = "repeating-linear-gradient(#e6e6fa 0px, #e6e6fa 28px, #966fd6 29px, #e6e6fa 30px)" ;
                    document.getElementById("journalpage").style.border="2px solid #966fd6" ;
                    applyfocusEffect("#966fd6","rgba(150, 123, 182, 0.5)");
                    applyfocusTitleEffect("#966fd6","rgba(150, 123, 182, 0.5)");
                    //changeimagecolor("#e6e6fa","#966fd6");
                    buttonColorHoverEffect="#966fd6";
                    buttonColorBackgroundEffect="#e6e6fa";
                }
                else if(color=='mistyrose'){
                    document.getElementById("journaltitle").style.backgroundColor = "#ffe4e1";
                    document.getElementById("selected_date").style.backgroundColor = "#ffe4e1";
                    document.getElementById("journaltitle").style.border="2px solid #f7bfbe";
                    document.getElementById("selected_date").style.border="2px solid #f7bfbe";
                    document.getElementById("journaltitle").style.borderBottom="none";
                    document.getElementById("selected_date").style.borderBottom= "none";
                    document.getElementById("selected_date").style.borderLeft="none";
                    document.getElementById("journalpage").style.backgroundImage = "repeating-linear-gradient( #ffe4e1 0px,  #ffe4e1 28px,#f7bfbe 29px, #ffe4e1 30px)" ;
                    document.getElementById("journalpage").style.border="2px solid #f7bfbe" ;
                    applyfocusEffect("#f7bfbe","rgba(230, 143, 172, 0.5)");
                    applyfocusTitleEffect("#f7bfbe","rgba(230, 143, 172, 0.5)");
                    //changeimagecolor("#ffe4e1","#f7bfbe");
                    buttonColorHoverEffect="#f7bfbe";
                    buttonColorBackgroundEffect="#ffe4e1";
                }
                else if(color=='unbleachedsilk'){
                    document.getElementById("journaltitle").style.backgroundColor = "#ffddca";
                    document.getElementById("selected_date").style.backgroundColor = "#ffddca";
                    document.getElementById("journaltitle").style.border="2px solid #ff8c69";
                    document.getElementById("selected_date").style.border="2px solid #ff8c69";
                    document.getElementById("journaltitle").style.borderBottom="none";
                    document.getElementById("selected_date").style.borderBottom= "none";
                    document.getElementById("selected_date").style.borderLeft="none";
                    document.getElementById("journalpage").style.backgroundImage = "repeating-linear-gradient( #ffddca 0px,  #ffddca 28px, #ff8c69 29px,  #ffddca 30px)" ;
                    document.getElementById("journalpage").style.border="2px solid #ff8c69" ;
                    applyfocusEffect("#ff8c69","rgba(255, 117, 24, 0.5)");
                    applyfocusTitleEffect("#ff8c69","rgba(255, 117, 24, 0.5)");
                    //changeimagecolor("#ffddca","#ff8c69");
                    buttonColorHoverEffect="#ff8c69";
                    buttonColorBackgroundEffect="#ffddca";
                }
                document.getElementById("journalpage").removeEventListener("focus",focusEffect);
                document.getElementById("journalpage").addEventListener("focus",focusEffect);
                document.getElementById("journalpage").removeEventListener("blur",removefocusEffect);
                document.getElementById("journalpage").addEventListener("blur",removefocusEffect);

                document.getElementById("journaltitle").removeEventListener("focus",focusTopEffect);
                document.getElementById("journaltitle").addEventListener("focus",focusTopEffect);
                document.getElementById("journaltitle").removeEventListener("blur",removefocusTopEffect);
                document.getElementById("journaltitle").addEventListener("blur",removefocusTopEffect);

                document.getElementById("upload-btn").removeEventListener("mouseover",applyhoverEffect);
                document.getElementById("upload-btn").removeEventListener("mouseout",removehoverEffect)
                document.getElementById("upload-btn").addEventListener("mouseover",(event) =>applyhoverEffect(event,buttonColorHoverEffect));
                document.getElementById("upload-btn").addEventListener("mouseout",(event) =>removehoverEffect(event,buttonColorBackgroundEffect));
            }

            /*
            function changeimagecolor(buttonBackground,borderImageColor)
            {
                document.getElementById("image-container").style.border="2px solid "+borderImageColor;
                document.getElementById("upload-btn").style.background=buttonBackground;
                document.getElementById("upload-btn").style.border="2px solid "+borderImageColor;

            }
                */
            
            function focusEffect()
            {
                console.log("Focus effect triggered!");
                this.style.outline="none";
                this.style.border=`2px solid ${focusBorderColor}`;
                this.style.boxShadow=`0 0 5px ${focusBoxShadow}`;
            }

            function focusTopEffect()
            {
                console.log("Focus top effect triggered!");
                this.style.outline="none";
                this.style.border=`2px solid ${focusTitleBorderColor}`;
                this.style.boxShadow=`0 0 5px ${focusTitleBoxShadow}`;
            }

            function removefocusEffect()
            {
                console.log("Blur Enabled!");
                this.style.boxShadow="none";
                this.style.borderColor="2px solid "+focusBorderColor;
            }

            function removefocusTopEffect()
            {
                console.log("Blur for Top Enabled!");
                this.style.boxShadow="none";
                this.style.borderColor="2px solid "+focusTitleBorderColor;
                this.style.borderBottom="none";
            }

            function applyhoverEffect(event,buttonColorhover)
            {

                event.target.style.background=buttonColorhover;
            }

            function removehoverEffect(event,buttonColorbackground)
            {
                event.target.style.background=buttonColorbackground;
            }

            function applyfocusEffect(borderColor,boxShadow)
            {
                focusBorderColor=borderColor;
                focusBoxShadow=boxShadow;
            }

            function applyfocusTitleEffect(titleborderColor,titleboxShadow)
            {
                focusTitleBorderColor=titleborderColor;
                focusTitleBoxShadow=titleboxShadow;
            }
        };

            function displaydate()
            {
                let date=document.getElementById("datepicker").value;
                document.getElementById("selected_date").innerText=date;
            }
        

        let imageContainer = document.getElementById("image-container");
        let fileInput = document.getElementById("file-input");

        /*fileInput.addEventListener("change", function(event) {
            let files = event.target.files;
            
            // Prevent upload if more than 10 images are selected
            if (imageContainer.children.length + files.length > 10) {
                alert("You can only upload up to 10 images.");
                return;
            }

            for (let i = 0; i < files.length; i++) {
                let file = files[i];

                if (!file.type.startsWith("image/")) continue; // Skip non-image files
                
                let reader = new FileReader();
                reader.onload = function(e) {
                    let img = document.createElement("img");
                    img.src = e.target.result;
                    img.classList.add("image-preview");

                    // Remove image on click
                    img.addEventListener("click", function() {
                        imageContainer.removeChild(img);
                    });

                    imageContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });*/
});
