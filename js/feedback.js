const nameField = document.getElementById("name");
const mailField = document.getElementById("email");
const numField = document.getElementById("number");
const msgField = document.getElementById("fmessage");
const sendLetter = document.getElementById("sendLetter");
const cancelButton = document.getElementById("cancelButton");


function addDataToDB(object) {
    const db = firebase.firestore();
    console.log(db);
    db.collection("Feedback")
        // .doc(userData.uid)
        .add(object)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}


function sendfeedback(event) {

    event.preventDefault();
    const name = nameField.value
    const mail = mailField.value
    const num = numField.value;
    const msg = msgField.value;

    if (name && mail && msg) {

        const object = { name: name, email: mail, number: num, message: msg }
        addDataToDB(object)
        document.body.classList.add("sent");
        removeFields();
        window.alert("Thank you for your feedback!");
    }
    else
    {
        window.alert("Please enter all the values");
    }

}

sendLetter.addEventListener("click", sendfeedback);

// function removeFields() {
//     console.log("Entered cancel");
//     nameField.value = "";
//     mailField.value = "";
//     numField.value = "";
//     msgField.value = "";

// }

// cancelButton.addEventListener("click", removeFields);