
const printButton = document.getElementById("print-button");

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
    if (data?.id) {
        getDetailsFromDB(data.id);
    }
    else {
        alert("Invalid ID");
        window.location.replace("./home.html")
    }
}

getData();

function setData(data,ticketId) {
    const moviename = document.getElementById("movie-name");
    const cinemaname = document.getElementById("cinema-name");
    const cityname = document.getElementById("city-name");
    const bookdate = document.getElementById("book-date");
    const booktime = document.getElementById("book-time");
    const seatnumber = document.getElementById("seat-number");
    const price = document.getElementById("price");
    const ticketid = document.getElementById("ticket-id");

    switch (data.movieName) {
        case 'spiderman': moviename.innerHTML = "Spiderman: No Way Home";
            break;
        case 'pushpa': moviename.innerHTML = "Pushpa: The Rise";
            break;
        case 'tonic': moviename.innerHTML = "Tonic";
            break;
    }

    switch (data.city) {
        case 'kolkata': cityname.innerHTML = "Kolkata";
            break;
        case 'mumbai': cityname.innerHTML = "Mumbai";
            break;
        case 'delhi': cityname.innerHTML = "Delhi";
            break;
    }

    cinemaname.innerHTML = data.cinemaName;
    bookdate.innerHTML = data.date;
    booktime.innerHTML = data.time;
    
    let s = "";
    for(let i = 0; i<data.seats.length; i++)
    {
        s+=data.seats[i]+" ";
    }

    seatnumber.innerHTML = s;
    price.innerHTML = "Rs "+data.price;
    ticketid.innerHTML = ticketId;

}

function getDetailsFromDB(paymentid) {
    const db = firebase.firestore();
    // console.log(db);
    db.collection("Tickets")
        .doc(paymentid)
        .get()
        .then((doc) => {
            console.log(doc.data(),paymentid);
            setData(doc.data(),paymentid);

        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

function printDetails()
{
    window.print();
}

printButton.addEventListener("click",printDetails);