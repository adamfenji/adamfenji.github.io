//Accessing Clock elements from the HTML document
let hourValue = document.querySelector("#hourValue");
let minValue = document.querySelector("#minValue");
let dateValue = document.querySelector("#dateValue");

//This method is for getting [week, month, day, year, time] from the Date object
function datePrint(){

    let date = new Date();
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let week = weekDays[date.getDay()];
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();

    return week + " " + month + " " + day + " " + year;
}

//This method is for updating the time and page every second
function update(){

    let date = new Date();
    
    let DateTime = luxon.DateTime;
    let local = DateTime.local();
    let relocated = local.setZone(localWeather.timeZone);

    hourValue.innerText = relocated.c.hour;
    minValue.innerText = date.getMinutes();
    dateValue.innerText = datePrint();

    if(hourValue.innerText.length == 1){
        let temp = hourValue.innerText;
        hourValue.innerText = "0" + temp;
    }
    if(minValue.innerText.length == 1){
        let temp = minValue.innerText;
        minValue.innerText = "0" + temp;
    }
}

//Accessing the styling elements of the page
let dateContainer = document.querySelector(".dateContainer");
let hourDisplay = document.querySelector(".hourDisplay");
let minDisplay = document.querySelector(".minDisplay");
let searchButton = document.querySelector("#searchButton");
let searchBar = document.querySelector("#searchBar");
let pageIcon = document.querySelector("#pageIcon");



//This method is used to switch from Night Mode into Ligth mode, vise versa
function theme(){

    // Get the width and height of the window
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(7 > hourValue.innerHTML || hourValue.innerHTML > 19){
        dateContainer.setAttribute("class", "dateContainerDark"); 
        hourDisplay.setAttribute("class", "hourDisplayDark");
        minDisplay.setAttribute("class", "minDisplayDark");
        searchBar.setAttribute("id", "searchBarDark");
        searchButton.setAttribute("id", "searchButtonDark");
        document.body.style.backgroundColor = "#000000d0";
        VANTA.CLOUDS({
            el: "body",
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: windowHeight - 20,
            minWidth: windowWidth - 15,
            skyColor: 0x0,
            cloudShadowColor: 0x0,
            sunColor: 0xf7f7f7,
            sunGlareColor: 0x30303,
            sunlightColor: 0x3d3d3a
        })
    }
    else{
        dateContainer.setAttribute("class", "dateContainer"); 
        hourDisplay.setAttribute("class", "hourDisplay");
        minDisplay.setAttribute("class", "minDisplay");
        searchBar.setAttribute("id", "searchBar");
        searchButton.setAttribute("id", "searchButton");
        document.body.style.backgroundColor = "#ffffffd0";
        VANTA.CLOUDS({
            el: "body",
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: windowHeight - 20,
            minWidth: windowWidth - 15,
            })
    }
}

//Accessing elements from the HTML document
let temperature = document.querySelector("#temp");
let conditionIcon = document.querySelector("#contidionsIcon");
let cityTemp = document.querySelector("#cityTemp");
let checkbox = document.querySelector("#checkboxStatus");

//localWeather object for storing the weather conditions of a given city / timezone
let localWeather = {
    city: "Houghton, MI",
    temp: 00,
    tempType: "F",
    condition: "clear-day",
    timeZone: "America/Detroit",
}

//conditionsMap map for mapping every weather icon to its url
let conditionsMap = new Map();
conditionsMap.set("clear-day", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/clear-day.png");
conditionsMap.set("clear-night", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/clear-night.png");
conditionsMap.set("cloudy", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/cloudy.png");
conditionsMap.set("partly-cloudy-day", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/partly-cloudy-day.png");
conditionsMap.set("partly-cloudy-night", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/partly-cloudy-night.png");
conditionsMap.set("rain", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/rain.png");
conditionsMap.set("showers-day", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/showers-day.png");
conditionsMap.set("showers-night", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/showers-night.png");
conditionsMap.set("snow", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/snow.png");
conditionsMap.set("thunder-rain", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/thunder-rain.png");
conditionsMap.set("wind", "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/wind.png");


//async function for interracting with the weather API
async function checkWeather(){
    const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + localWeather.city + "?key=DL4YWD5J4W95TU5YZMNLGHJD3");
    const data = await response.json();

    localWeather.temp = data.currentConditions.temp;
    localWeather.condition = data.currentConditions.icon;
    localWeather.timeZone = data.timezone;

    cityTemp.innerText = "Current weather & time in " + localWeather.city;
    for(let [key, value] of conditionsMap){
        if(key === localWeather.condition){
            conditionIcon.innerHTML = "<img src='" + conditionsMap.get(localWeather.condition) + "' alt='weatherIcon'>";
            pageIcon.setAttribute("href", conditionsMap.get(localWeather.condition));
        }
    }
    temperature.innerText = localWeather.temp + "°" + localWeather.tempType;

};

// getting the city name when the user clicks on the search button
searchButton.addEventListener("click", () => {
    localWeather.city = searchBar.value;
    update();
    checkWeather();
    setTimeout(() => {
        theme();
    }, 1500);
    
});


//unit conversion from C to F and vise versa, uses a toggle box
checkbox.addEventListener("change", function() {
    if (checkbox.checked) {
        localWeather.tempType = "C";
        temperature.innerText = ((localWeather.temp - 32) * (5/9)).toFixed(1) + "°" + localWeather.tempType;
    } else {
        localWeather.tempType = "F";
        temperature.innerText = localWeather.temp + "°" + localWeather.tempType;
    }
});

//Calling the functions:
update();
setInterval(update, 1000);
checkWeather();
theme();
