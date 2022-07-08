// const firebaseConfig = {
//     apiKey: "AIzaSyCthd6W56IDbm2O3i4Ryyz5mSAp219yFDw",
//     authDomain: "cinema-booking-a48a8.firebaseapp.com",
//     projectId: "cinema-booking-a48a8",
//     storageBucket: "cinema-booking-a48a8.appspot.com",
//     messagingSenderId: "188746614536",
//     appId: "1:188746614536:web:5a0a87e6d188edf8128ebd",
//     measurementId: "G-SBT6W5R96W"
// };

// // var firebase = fireBase || firebase;
// var hasInit = false;
// let app = null;

// if(!hasInit){
//     // Initialize Firebase
//     app = firebase.initializeApp(firebaseConfig);
//     hasInit = true;
// }

const phoneNumberField = document.getElementById("number");
const getCodeButton = document.getElementById("getOTP");
const signInWithPhoneButton = document.getElementById("login");
const codeField = document.getElementById("otp");

const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // var uid = user.uid;
    // console.log(user);
    // ...

    window.location.replace("./home.html");
  } else {
    // User is signed out
    // ...
  }
});


window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  "recaptcha-container"
);

recaptchaVerifier.render().then((widgetId) => {
  window.recaptchaWidgetId = widgetId;
});


const sendVerificationCode = () => {
  const phoneNumber = "+91" + phoneNumberField.value;
  const appVerifier = window.recaptchaVerifier;
//   console.log("abdc");
  auth
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      console.log("confirmationResult => ", confirmationResult);
      window.alert("OTP Sent!");
      const sentCodeId = confirmationResult.verificationId;
      signInWithPhoneButton.addEventListener("click", () =>
        signInWithPhone(sentCodeId)
      );
    })
    .catch((error) => {
      console.error(error);
      window.alert("Could not send OTP!");
    });
};

const signInWithPhone = (sentCodeId) => {
  const code = codeField.value;
  const credential = firebase.auth.PhoneAuthProvider.credential(
    sentCodeId,
    code
  );
  console.log("credential => ", credential);
  auth
    .signInWithCredential(credential)
    .then((res) => {
      localStorage.setItem("UserID",res.uid);
      window.location.assign("./home.html");
      console.log("res => ", res);
    })
    .catch((error) => {
      console.error(error);
      window.alert("Could not log in!");
    });
};

getCodeButton.addEventListener("click", sendVerificationCode);

// function checkLogIn()
// {
//   if(auth.currentUser)
//   {
//     window.location.replace("./home.html");
//   }

//   console.log(firebase.auth());
// }

// checkLogIn();

