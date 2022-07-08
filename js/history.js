
    // var node1 = document.createElement("LI");     
    // var node2 = document.createElement("LI");  
    // node1.innerHTML = '<p>spiderman</p><p>10:00 AM</p><a href="./payment.html">See History</a>';
    // node2.innerHTML = '<p>spiderman</p><p>10:00 AM</p><a href="./payment.html">See History</a>';               
    // document.getElementById("bookings").appendChild(node1);
    // document.getElementById("bookings").appendChild(node2);

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
    // queryData = data;
    if (data?.uid) {
        getDetailsFromDB(data.uid);
    }
    else {
        alert("Invalid ID");
        window.location.replace("./home.html")
    }
}

getData();

function getTime(timeStamp){
    var timestamp = timeStamp;
    var date = new Date(timestamp);

    console.log("Date: "+date.getDate()+
            "/"+(date.getMonth()+1)+
            "/"+date.getFullYear()+
            " "+date.getHours()+
            ":"+date.getMinutes()+
            ":"+date.getSeconds());

    return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}

function setData(tickets) {
    const list = document.getElementById("bookings");
    for(let i = 0; i<tickets.length; i++)
    {
        const data = tickets[i].data();
        const id = tickets[i].id;

        var mname = "";

        switch (data.movieName) {
            case 'spiderman': mname = "Spiderman: No Way Home";
                break;
            case 'pushpa': mname = "Pushpa: The Rise";
                break;
            case 'tonic': mname = "Tonic";
                break;
        }
        
        var node = document.createElement("LI");
        var dateTime = getTime(parseInt(data.bookedTimestamp));
        node.innerHTML = '<p>Movie: '+mname+'</p><p>Date Booked: '+dateTime+'</p><a href="./payment.html?id='+id+'">See History</a>';
        list.appendChild(node);
    }
}

function getDetailsFromDB(uid) {
    const db = firebase.firestore();
    // console.log(db);
    db.collection("Tickets")
        .where("userId", "==", uid)
        .get()
        .then((res) => {
            console.log(res);
            setData(res.docs);

        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

