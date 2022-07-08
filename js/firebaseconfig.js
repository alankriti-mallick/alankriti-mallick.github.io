const firebaseConfig = {
    apiKey: "AIzaSyCthd6W56IDbm2O3i4Ryyz5mSAp219yFDw",
    authDomain: "cinema-booking-a48a8.firebaseapp.com",
    projectId: "cinema-booking-a48a8",
    storageBucket: "cinema-booking-a48a8.appspot.com",
    messagingSenderId: "188746614536",
    appId: "1:188746614536:web:5a0a87e6d188edf8128ebd",
    measurementId: "G-SBT6W5R96W"
};

// var firebase = fireBase || firebase;
var hasInit = false;
let app = null;

if(!hasInit){
    // Initialize Firebase
    app = firebase.initializeApp(firebaseConfig);
    hasInit = true;
}