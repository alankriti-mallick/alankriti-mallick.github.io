const seatSelect = document.getElementById('seatCount');
const price = document.getElementById('pay-button-price');
let totalcount = seatSelect.value;
var count = 1;

let stime = null;
let cin = null;
let movie = null;
let queryData = null;
let selectedScreenTime = null;

const paybutton = document.getElementById("pay-button");

function bookedSeats(seats) {
  for (let i = 0; i < seats.length; i++) {
    const s = document.getElementById(seats[i]);
    $(s).addClass("seat-selected");
  }
}

function setSeats() {
  console.log("setseats");
  if ($(".timeOptions button").hasClass('active') && $(".dateOptions button").hasClass('active')) {

    let date = $(".dateOptions button.active");
    let time = $(".timeOptions button.active");

    date = date.text().trim();
    time = time.text().trim();

    console.log(date);
    console.log(time);
    if (stime) {
      console.log(stime);
      for (let i = 0; i < stime.length; i++) {
        const data = stime[i].data();
        console.log(data);
        if (data.time === time && data.date === date) {
          console.log(data.seatsbooked);
          selectedScreenTime = data;
          selectedScreenTime.id = stime[i].id;
          bookedSeats(data.seatsbooked);
          break;
        }
      }
    }
    // console.log(date.text().trim());
  }
}

$(".dateOptions button").on('click', function () {
  $(this).siblings().removeClass('active');
  $(".seats button").removeClass("no-click");
  $(".seats button").removeClass("seat-selected");

  $(this).toggleClass("active");
  $(".seats button").removeClass("active");
  // console.log(totalcount);
  price.innerText = 0;
  count = 1;
  console.log("Clicked", this);
  setSeats();
})

$(".timeOptions button").on('click', function () {
  $(this).siblings().removeClass('active');
  $(".seats button").removeClass("no-click");
  $(".seats button").removeClass("seat-selected");

  $(this).toggleClass("active");
  $(".seats button").removeClass("active");
  // console.log(totalcount);
  price.innerText = 0;
  count = 1;
  console.log("Clicked", this);
  setSeats();

})

seatSelect.addEventListener('change', e => {
  totalcount = e.target.value;
  $(".seats button").removeClass("active");
  // console.log(totalcount);
  price.innerText = 0;
  count = 1;
})

$(".seats button").on('click', function () {
  // $(this).siblings().removeClass('active');

  if ($(".timeOptions button").hasClass('active') && $(".dateOptions button").hasClass('active')) {
    if ($(this).hasClass("seat-selected")) {
      return;
    }

    $(this).removeClass("no-click");
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      count--;
      price.innerText = (count - 1) * 250;
    }
    else if (count <= totalcount) {
      $(this).addClass("active");
      count++;
      price.innerText = (count - 1) * 250;
    }
  }
  else {
    $(this).addClass("no-click");
    window.alert("Please select date and time")
  }

  console.log("Clicked", this);
})

async function getDetailsFromDB(cinemaname, moviename) {
  const db = firebase.firestore();

  try {
    const cinemas = await db
      .collection("CinemaHall")
      .where("name", "==", cinemaname)
      .get();

    cin = cinemas.docs[0].data();
    cin.id = cinemas.docs[0].id;
    console.log(cin);
    const movies = await db
      .collection("CinemaHall")
      .doc(cin.id)
      .collection("movies")
      .where("name", "==", moviename.toLowerCase())
      .get();

    movie = movies.docs[0].data();
    movie.id = movies.docs[0].id;
    // console.log(movies);
    const screentime = await db
      .collection("CinemaHall")
      .doc(cin.id)
      .collection("movies")
      .doc(movie.id)
      .collection("screentime")
      .get();

    stime = screentime.docs;
    console.log(stime);
  }
  catch (error) {
    console.log(error);
  }
}

function getQueryDataArray() {
  /* It returns array of keys and values in url query string
    eg. for url = http://localhost:3000/index.html?key1=value1&key2=value2
    then it will return [['key1', 'value1'], ['key2', 'value2']]
    */
  const queries = window.location.href.split("?")[1];

  if (queries) {
    let array = [];
    const urlParams = new URLSearchParams(queries);

    for (const item of urlParams) {
      array.push(item);
    }

    return array;
  }
  return null;
}

function getQueryDataObject() {
  /* It returns object with all keys and values in url query string
    eg. for url = http://localhost:3000/index.html?key1=value1&key2=value2
    then it will return {'key1': 'value1', 'key2': 'value2']
    */
  const array = getQueryDataArray();
  if (array) {
    const arrayOfObject = Object.fromEntries(array);
    return arrayOfObject;
  }

  return null;
}

function getData() {
  const data = getQueryDataObject();
  queryData = data;
  if (data) {
    getDetailsFromDB(data.cinema, data.movie);
  }
}

getData();

function getBookedSeats() {
  const seats = $(".seats .seat-row button.active");
  console.log(seats);

  const bookedSeats = [];

  for (let i = 0; i < seats.length; i++) {
    bookedSeats.push($(seats[i]).text().trim());
    // console.log($(seats[i]).text().trim());
  }

  return bookedSeats;

}

async function bookTicket() {
  const bookedSeats = getBookedSeats();
  console.log(bookedSeats);
  // const batch = db.batch();

  // let date = $(".dateOptions button.active");
  // let time = $(".timeOptions button.active");

  // date = date.text().trim();
  // time = time.text().trim();

  let date = selectedScreenTime.date;
  let time = selectedScreenTime.time;

  let price = 250 * bookedSeats.length;
  const userId = localStorage.getItem("UserID");

  const bookedTimestamp= Date.now();
  const data = { movieName: movie.name, cinemaName: cin.name, city: cin.city, date: date, time: time, bookedTimestamp: bookedTimestamp, price: price,
     seats:bookedSeats,userId:userId};

  const totalBookedSeats = selectedScreenTime.seatsbooked.concat(bookedSeats);
  const db = firebase.firestore();
  const batch = db.batch();
  const ticketRef = db.collection("Tickets").doc();

  const screentimeRef = db.collection("CinemaHall").doc(cin.id).collection("movies").doc(movie.id).collection("screentime").doc(selectedScreenTime.id);
  batch.set(ticketRef,data);
  batch.update(screentimeRef,{seatsbooked:totalBookedSeats});
  batch.commit()
    .then(()=>{
      console.log("ticket booked!");
      window.location.assign("/payment.html?id="+ticketRef.id);
    })
    .catch((error)=>{
      console.log(error);
    });

  // console.log(ticketRef);
}


paybutton.addEventListener('click', bookTicket);