const cityInput = document.querySelector('#city');
const cityButton = document.querySelector('#searchButton');
const cityNameEl = document.querySelector('#city-name');
let cityArr = [];

//@@@@@@@@@@@@@@@@@@@@
// fetches weather
//@@@@@@@@@@@@@@@@@@@@

const getData = function(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=e4ab7318fab329c7de8c4fd9dd5056d7`;

    // console.log(city);
    fetch(url).then(function(response) {
        response.json().then(function(data) {
            const lon = data.coord['lon'];
            const lat = data.coord['lat'];
            getForecast(city, lon, lat);
            document.querySelector('.city-list').remove();
            saveCity(city);
            start();
        });
     
    })
   
};

//@@@@@@@@@@@@@@@@@@@@
// Process user input
//@@@@@@@@@@@@@@@@@@@@
const formHandler = function (event) {
    getData(cityInput.value);
    
}


//@@@@@@@@@@@@@@@@@@@@
// fetches 5day FORECAST
//@@@@@@@@@@@@@@@@@@@@
const getForecast = (city, lon, lat) => {
    const url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=e4ab7318fab329c7de8c4fd9dd5056d7`;
    fetch(url2).then(function (response) {
            response.json().then(function (data) {
                cityNameEl.textContent = city+ " - " +moment().format("M/D/YYYY");
                actual(data);
                forecast(data);
            });
    });
}


//@@@@@@@@@@@@@@@@@@@@
// 5 Day Forecast
//@@@@@@@@@@@@@@@@@@@@
const forecast = function(forecast) { 
    let element = [];
    for (var i = 1; i < 6; i++) {
        let dateP = document.querySelector('#date-' + i);
        dateP.textContent = moment().add(i, 'days').format('M/D/YYYY');

        let iconImg = document.querySelector('#icon-' + i);
        let iconCode = forecast.daily[i].weather[0].icon;
        iconImg.setAttribute('src', `http://openweathermap.org/img/wn/${iconCode}.png`);
        iconImg.setAttribute('alt', forecast.daily[i].weather[0].main);
        element[i] = document.querySelector('#temp-' + i);
        element[i].textContent = forecast.daily[i].temp.day;
        let humiditySpan = document.querySelector('#humidity-' + i);
        humiditySpan.textContent = forecast.daily[i].humidity;
    }
}

//@@@@@@@@@@@@@@@@@@@@
// Actual
//@@@@@@@@@@@@@@@@@@@@
const actual = function(forecast) {
    
    const forecastEl = document.querySelector('.city-forecast');
    forecastEl.classList.remove('hide');

    const weatherIconEl = document.querySelector('#today-icon');
    const currentIcon = forecast.current.weather[0].icon;
    weatherIconEl.setAttribute('src', `http://openweathermap.org/img/wn/${currentIcon}.png`);
    weatherIconEl.setAttribute('alt', forecast.current.weather[0].main)

  
    let element = document.querySelector('#current-temp');
    element.textContent = forecast.current['temp'];
    let currentHumidityEl = document.querySelector('#current-humidity');
    currentHumidityEl.textContent = forecast.current['humidity'];
    let currentWindEl = document.querySelector('#current-wind-speed')
    currentWindEl.textContent = forecast.current['wind_speed'];
    let uviEl = document.querySelector('#current-uvi')
    uviEl.textContent = forecast.current['uvi'];

    if (forecast.current['uvi'] <= 2) {
        uviEl.className = 'badge badge-success';
    }
    else if (forecast.current['uvi'] <= 5) {
        uviEl.className = 'badge badge-warning';
    }
    else if (forecast.current['uvi'] <= 7) { 
        uviEl.className = 'badge badge-danger';
    }  
 
}




//@@@@@@@@@@@@@@@@@@@@
// LocalStorage to save cities
//@@@@@@@@@@@@@@@@@@@@
const saveCity = function(city) {

    // prevents duplicate city from being saved and moves it to end of array
    for (let i = 0; i < cityArr.length; i++) {
        if (city === cityArr[i]) {
            cityArr.splice(i, 1);
        }
    }

    cityArr.push(city);
    localStorage.setItem('cities', JSON.stringify(cityArr));
}

//@@@@@@@@@@@@@@@@@@@@
// Reads from local storage
//@@@@@@@@@@@@@@@@@@@@
const start = function() {
    cityArr = JSON.parse(localStorage.getItem('cities'));

    if (!cityArr) {
        cityArr = [];
        return false;
    } else if (cityArr.length > 5) {
        // saves only the five most recent cities
        cityArr.shift();
    }

    const recentCities = document.querySelector('#recent-cities');
    const cityListUl = document.createElement('ul');
    cityListUl.className = 'list-group list-group-flush city-list';
    recentCities.appendChild(cityListUl);

    for (let i = 0; i < cityArr.length; i++) {
        const cityListItem = document.createElement('button');
        cityListItem.setAttribute('type', 'button');
        cityListItem.className = 'list-group-item';
        cityListItem.setAttribute('value', cityArr[i]);
        cityListItem.textContent = cityArr[i];
        cityListUl.prepend(cityListItem);
    }

    const cityList = document.querySelector('.city-list');
    cityList.addEventListener('click', lastSearchs)
}

const lastSearchs = function(event) {
    const clickedCity = event.target.getAttribute('value');
    getData(clickedCity);
}

start();
cityButton.addEventListener('click',formHandler);
 
// console.log(cityButton);

 



