const auth = firebase.auth();

const uname = document.getElementById("usernum");

$('#log-out').on('click', function(){
    // signOut(auth);
    console.log("logout");
    auth.signOut().then(() => {
        // Sign-out successful.
        localStorage.removeItem("UserID");
        window.location.assign("./index.html");
      }).catch((error) => {
        // An error happened.
      });
})

$('#bookhistory').on('click',function(event){
    event.preventDefault();
    const uid = localStorage.getItem("UserID");
    window.location.assign("./history.html?uid="+uid);
})

auth.onAuthStateChanged((user) => {
  if (user) {
    var pnum = user.phoneNumber;
    uname.innerHTML = pnum;
  } else {
    // User is signed out
    // ...
    window.location.replace("./index.html")
  }
});