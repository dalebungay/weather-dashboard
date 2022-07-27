var searchHistory = []
var lastCitySearched = ""

//call api to openweathermap.org
var getCityWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial";

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })  

        // alert user if there is error
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        })
};

// function to handle city search form submit
var searchSubmitHandler = function(event) {
    // stop page from refreshing
    event.preventDefault();

    // get value from input element
    var cityName = $("#cityname").val().trim();

    // check if the search bar has a value
    if(cityName) {
        // pass the value to getCityWeather function
        getCityWeather(cityName);

        // clear the search input
        $("#cityname").val("");
    } else {
        // alert user if there is no value entered
        alert("Please enter a city name");
    }
};

var displayWeather = function(weatherData) {

    // format and display the values
    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append;
    $("#main-city-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + "°F");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#main-city-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");

    // use lat & lon to make the uv api call
    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon="+ weatherData.coord.lon + "&appid=ce39e7239416ad754359ca762d28521a")
        .then(function(response) {
            response.json().then(function(data) {

                // display the UV index value
                $("#uv-box").text(data.value);

                // change color of UV index
                if(data.value >= 11) {
                    $("#uv-box").css("background-color", "green")
                } else if (data.value < 11 && data.value >= 8) {
                    $("#uv-box").css("background-color", "green")
                } else if (data.value < 8 && data.value >= 6) {
                    $("#uv-box").css("background-color", "green")
                } else if (data.value < 6 && data.value >= 3) {
                    $("#uv-box").css("background-color", "green")
                } else {
                    $("#uv-box").css("background-color", "green")
                }      
            })
        });

    // five-day api call
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial")
        .then(function(response) {
            response.json().then(function(data) {

                // clear the previous entries in the five-day weather forecast
                $("#five-day").empty();

                // returned array from the api
                for(i = 7; i <= data.list.length; i += 8){

                    // insert data into my day forecast card template
                    var fiveDayCard =`
                    <div class="col-md-2 m-2 py-3 card text-white bg-dark">
                        <div class="card-body p-1">
                            <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                            <img src="http://openweathermap.org/img/wn/`+ data.list[i].weather[0].icon + `.png" alt="rain">
                            <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                        </div>
                    </div>
                    `;

                    // append the day to the five-day forecast
                    $("#five-day").append(fiveDayCard);
               }
            })
        });

    // save the last city searched
    lastCitySearched = weatherData.name;

    // save its search history
    saveSearchHistory(weatherData.name);

    
};

// function to save the city search history to local storage
var saveSearchHistory = function (city) {
    if(!searchHistory.includes(city)){
        searchHistory.push(city);
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
    } 

    // save the searchHistory array to local storage
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));

    // save the lastCitySearched to local storage
    localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched));

    // display the searchHistory array
    loadSearchHistory();
};

// function to load saved city search history from local storage
var loadSearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    lastCitySearched = JSON.parse(localStorage.getItem("lastCitySearched"));
  
        if (!searchHistory) {
            searchHistory = []
        }

        if (!lastCitySearched) {
            lastCitySearched = ""
        }

    // clear the search-history ul
    $("#search-history").empty();

    for(i = 0 ; i < searchHistory.length ;i++) {

        // add the city as a link and append it to the search-history
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + searchHistory[i] + "'>" + searchHistory[i] + "</a>");
    }
  };

// load search history from local storage
loadSearchHistory();


$("#search-form").submit(searchSubmitHandler);
$("#search-history").on("click", function(event){
    // get the links value
    var prevCity = $(event.target).closest("a").attr("id");
    // pass id value to the getCityWeather function
    getCityWeather(prevCity);
});