import { db } from "./firebaseConfig.js";
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Array of petitions with images and dates
const petitions = [
    {
        title: "Equal Pay for Women",
        description: "Support gender pay equality across industries.",
        author: "Sarah Johnson",
        supporters: [],
        date: "05/11/23",
        image: "p2.jpg"
    },
    {
        title: "Better Mental Health Support in Schools",
        description: "Push for mandatory mental health counseling in schools.",
        author: "Alex Carter",
        supporters: [],
        date: "20/08/23",
        image: "p3.jpg"
    },
    {
        title: "Fight Against Domestic Violence",
        description: "Demand stricter laws to protect victims of abuse.",
        author: "Emily Davis",
        supporters: [],
        date: "12/10/23",
        image: "p4.jpg"
    },
    {
        title: "Ensure Equal Representation in Leadership",
        description: "Advocate for more women in executive roles.",
        author: "Rachel Brown",
        supporters: [],
        date: "03/07/23",
        image: "p5.jpg"
    },
    {
        title: "Raise Awareness on Postpartum Depression",
        description: "Call for better maternal mental health support.",
        author: "Olivia Martin",
        supporters: [],
        date: "22/06/23",
        image: "p6.jpg"
    },
    {
        title: "Support LGBTQ+ Mental Health Services",
        description: "Demand inclusive mental health support for LGBTQ+ individuals.",
        author: "Daniel White",
        supporters: [],
        date: "10/05/23",
        image: "p7.jpg"
    },
    {
        title: "Gender Equality in Sports",
        description: "Ensure equal pay and opportunities for female athletes.",
        author: "Chris Evans",
        supporters: [],
        date: "14/04/23",
        image: "p8.jpg"
    },
    {
        title: "Mandatory Mental Health Training for Police",
        description: "Push for law enforcement to receive mental health training.",
        author: "Kevin Harris",
        supporters: [],
        date: "08/03/23",
        image: "p9.jpg"
    },
    {
        title: "End Period Poverty",
        description: "Call for free menstrual hygiene products in schools and workplaces.",
        author: "Sophia Lee",
        supporters: [],
        date: "19/02/23",
        image: "p10.jpg"
    },
    {
        title: "Fund More Mental Health Resources in Schools",
        description: "Schools should have more counselors and mental health programs to support students.",
        author: "Sophia Lee",
        supporters: [],
        date: "19/02/23",
        image: "p11.jpg"
    },
    {
        title: "Equal Pay for Equal Work",
        description: "Support legislation that ensures women receive equal pay for the same work as men.",
        author: "Sophia Lee",
        supporters: [],
        date: "19/02/23",
        image: "p12.jpg"
    }
];

// Function to add petitions to Firestore
async function addPetitions() {
    const petitionsRef = collection(db, "petitions");

    for (const petition of petitions) {
        try {
            const petitionDoc = doc(petitionsRef, petition.title);
            await setDoc(petitionDoc, petition);
            console.log(`✅ Petition Added: ${petition.title}`);
        } catch (error) {
            console.error(`❌ Error adding ${petition.title}:, error`);
        }
    }

    console.log("🔥 All petitions added successfully!");
}

// Run the function
addPetitions();