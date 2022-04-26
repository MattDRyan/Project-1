// Constants declarations
const variables = window.location.href.split("?")[1].split("&"); //read current location and get variables generated as results from the index.html page
const mood = variables[0].split("=")[1]; // assign mood from the variables
const cuisine = variables[1].split("=")[1]; // assign cuisine from the variables

// Variable declarations
// Getting HTML elements to dynamically change
var restaurantTitle = document.querySelector("#restaurant-name");
var restaurantImage = document.querySelector("#restaurant-image");
var restaurantAddress = document.querySelector("#restaurant-address");
var restaurantBtn = document.querySelector("#restaurant-btn");

// Declaring maps API variables
var map; //map variable to hold the map
var service; //service variable to hold the to hold the PlacesService
var result; //result variable to hold the callback results

// initialising function gets called from the API script in HTML: 'callback = "initMap"'
function initMap() {
  // creating a new location (Adelaide) to display while results are fetched
  var adelaide = new google.maps.LatLng(-34.928654, 138.59989);

  // assigning the map variable with the HTML element
  map = new google.maps.Map(document.getElementById("maps"), {
    center: adelaide, //current center of map
    zoom: 15, //zoom level (Streets)
  });

  // API search request
  var request = {
    query: cuisine, //query the Cuisine generated
    openNow: true, //make sure restaurant is openNow
    type: ["restaurant"], //type of restaurant
  };

  // assign service variable with the Places service
  service = new google.maps.places.PlacesService(map);
  // call the textSearch method to get search results
  service.textSearch(request, callback);
}

// callback function for the API request
function callback(results, status) {
  // if statement to check if API call succeeded
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // if succeeded then result variable = results returned
    result = results;
    // call writeRestaurantData function to write result
    writeRestaurantData(result[0]);
  } else {
    // if the API call failed then print error message
    console.log("Error" + google.maps.places.PlacesServiceStatus);
  }
}

// functions to write the results
function writeRestaurantData(place) {
  // set map location to the current restaurant location
  map = new google.maps.Map(document.getElementById("maps"), {
    center: place.geometry.location,
    zoom: 15,
  });

  // add marker on the map at the restaurant location
  new google.maps.Marker({
    map,
    draggable: false, //make the marker non draggable
    position: place.geometry.location,
  });

  // set the name of the restaurant
  restaurantTitle.textContent = place.name;

  // get an image url from the restaurant object
  var imageUrl = place.photos[0].getUrl();

  // write the image to the HTML document
  restaurantImage.innerHTML =
    '<img src="' + imageUrl + '" alt="Picture of the restaurant">';

  // write the address of the restaurant to the HTML document
  restaurantAddress.textContent = place.formatted_address;

  // convert the name from a string to an array
  var nameArray = place.name.split(" ");

  // create search URL to send to created button's href parameter
  var searchUrl =
    "https://www.google.com/search?q=" +
    nameArray
      .map((word, idx) => {
        var string = "";
        if (idx < nameArray.length - 1) {
          string += word + "+";
        } else {
          string += word;
        }
        return string;
      })
      .join("");

  // Create the button element for the restaurant
  restaurantBtn.innerHTML =
    '<button class="rounded-full bg-sky-600 px-5 py-1 hover:bg-sky-200 hover:text-black mb-1" style="font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;"><a href = "' +
    searchUrl +
    '" target = "_blank">More Info</a></button>';
}

//with_genres=Comma separated value of genre ids that you want to include in the results. String
//{"id":28,"name":"Action"},{"id":10752,"name":"War"},{"id":12,"name":"Adventure"},{"id":37,"name":"Western"}

//{"id":16,"name":"Animation"},,{"id":10751,"name":"Family"},{"id":10770,"name":"TV Movie"},{"id":18,"name":"Drama"}

//{"id":80,"name":"Crime"},{"id":36,"name":"History"},{"id":99,"name":"Documentary"},{"id":878,"name":"Science Fiction"}

//,{"id":27,"name":"Horror"},{"id":53,"name":"Thriller"},{"id":9648,"name":"Mystery"}

//{"id":10749,"name":"Romance"},{"id":35,"name":"Comedy"},{"id":14,"name":"Fantasy"},{"id":10402,"name":"Music"}

//Mood is set by the result of the five questions

const MOODS = {
    imAmped: "28,10752,12,37",
    familyVibe: "16,10751,10770,18",
    thinker: "80,36,99,878",
    frightNight: "27,53,9648",
    loveIn: "10749,35,14,10402",
};

//Result of questionsn will be added to this variable
var mood = [];

// var raw = "";

// var requestOptions = {
//   method: 'GET',
//   body: raw,
//   redirect: 'follow'
// };


var displayMovieData = function (data){
    console.log(data);
    var movieContainerEl = document.querySelector('.movie-container');

    for(var i = 0; i <3; i++){
        var movieEl = document.createElement('div');
        
        var titleEl = document.createElement('p');
        var descEl = document.createElement('p');
        var posterEl = document.createElement('img');

        titleEl.innerText = data.results[i].title;
        descEl.innerText = data.results[i].overview;

        var imgSrc = 'https://image.tmdb.org/t/p/w500' + data.results[i].backdrop_path;
        posterEl.setAttribute('src', imgSrc)

        movieEl.appendChild(posterEl);
        movieEl.appendChild(titleEl);
        movieEl.appendChild(descEl);

        movieContainerEl.appendChild(movieEl);

    }
};

var getmovieList = function(mood = 'imAmped'){
    var baseMovieUrl = 'https://api.themoviedb.org/3/discover/movie?';
    //Movie Url attributes
    var movieApiKey = '157214d692672d4330ed9b68488df280'
    //language=Specify a language to query translatable fields with.
    var movieLanguage = 'en-US';
    //include_adult=A filter to include or exclude adult movies. Boolean
    var movieIncludeAdult = 'False';
    //with_original_language=Specify an ISO 639-1 string to filter results by their original language value. en is english.
    var movieWithOrigLang = 'en';
    // Get mood id from MOODS Obj
    var moodID = MOODS.mood;

    fetch(baseMovieUrl + 'api_key=' + movieApiKey + '&language=' + movieLanguage + '&include_adult=' + movieIncludeAdult + '&with_original_language=' + movieWithOrigLang + '&with_genres=' + moodID)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayMovieData(data);

    })
    .catch(error => console.log('error', error));
}


