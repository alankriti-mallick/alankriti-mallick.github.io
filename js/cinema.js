const n1 = document.getElementById("name1");
const n2 = document.getElementById("name2");
const n3 = document.getElementById("name3");

const b1 = document.getElementById("book1");
const b2 = document.getElementById("book2");
const b3 = document.getElementById("book3");


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
  
  // console.log(getQueryDataArray());
  // console.log(getQueryDataObject());
  
  $(".gotoNewPage").on("click", gotoNewPage); // Adding eventListener
  
  function gotoNewPage(e) {
    e.preventDefault();
    /* It redirect to a new path
      It is triggered onclick of any element with class 'gotoNewPage'
      !IMPORTANT! The element must have these three attributes
      1. path => the page to where to redirect eg. data-path='./test.html'
      2. key => the key of the data to be passed eg. data-key='city'
      3. value => the key of the data to be passed eg. data-value='kolkata'
      */
    const key = e.target.getAttribute("data-key");
    const value = e.target.getAttribute("data-value");
    const newPath = e.target.getAttribute("href");
    const varPath = "/cinema-to-movie.html";

    if (key && value && newPath) {
      const presentData = getQueryDataArray();
      let newLink = newPath + "?";
      let varnewLink = varPath + "?";
      let flag = 0;

      newLink = newLink + `${key}=${value}`;
      varnewLink = varnewLink + `${key}=${value}`;

      if (presentData) {
        presentData.forEach((item) => {
          newLink = newLink + `&${item[0]}=${item[1]}`;
          varnewLink = varnewLink + `&${item[0]}=${item[1]}`;
          if(item[0]==='movie')
            flag=1;
        });
      }
      //redirecting to the new link with data as url query string
      if(flag==1)
        window.location.assign(newLink);
      else
        window.location.assign(varnewLink);
    }
  }

function getData(){
    const data = getQueryDataObject();
    if(data)
    {
        getDetailsFromDB(data.city);
    }
}

function setData(cinemas)
{
    for(let i=0; i<cinemas.length; i++)
    {
        const cin = cinemas[i].data();
        switch(i)
        {
            case 0: n1.innerHTML = cin.name;
            b1.setAttribute("data-value",cin.name);
            break;
            case 1: n2.innerHTML = cin.name;
            b2.setAttribute("data-value",cin.name);
            break;
            case 2: n3.innerHTML = cin.name;
            b3.setAttribute("data-value",cin.name);
            break;
        }
    }
}

function getDetailsFromDB(cityName) {
    const db = firebase.firestore();
    // console.log(db);
    db.collection("CinemaHall")
        .where("city","==",cityName)
      .get()
      .then((response) => {
        console.log(response.docs);
        setData(response.docs);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
}

getData();
