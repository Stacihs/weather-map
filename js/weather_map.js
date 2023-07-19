$(() => {
    "use strict";

    /*****GLOBAL VARIABLES*****/
    const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
    const OPEN_WEATHER_URL_FIVE_DAY = "https://api.openweathermap.org/data/2.5/forecast";
    // const map = initializeMap();
    let userInputBox = document.querySelector('input');


    // TODO create loop to combine current and 5day forecast cards
    // TODO create marker on map for current city
    // TODO user can move marker or click on map and add marker
    // TODO weather updates as marker is moved


    /*****FUNCTIONS*****/

    // AJAX call for current weather in San Antonio creating map object with returned data
    $.ajax(OPEN_WEATHER_URL, {
        data: {
            APPID: OPEN_WEATHER_APPID, lat: 29.423017, lon: -98.48527, units: "imperial"
        }
    }).done((data) => {
        console.log('current weather', data);
        renderCurrentWeather(data);
        mapboxgl.accessToken = MAPBOX_TOKEN;

        const mapOptions = {
            container: 'map',
            style: 'mapbox://styles/mapbox/navigation-day-v1',
            center: [-98.491142, 29.424349],
            zoom: 10
        }
        return new mapboxgl.Map(mapOptions);


    }).fail(console.error);







    // Dynamically render html to DOM current forecast
    const renderCurrentWeather = ((weatherStats) => {
        $('#weatherInfoCurrent').append(`<div class="weatherCard">
                <h1>${weatherStats.name}</h1>
                <div><span id="temp">${parseInt(weatherStats.main.temp)}&deg;</span></div>
                <h2>Feels Like</h2>
                <div><span>${parseInt(weatherStats.main.feels_like)}&deg;</span></div>
                <h2>Humidity</h2>
                <div><span>${parseInt(weatherStats.main.humidity)}%</span></div>
                <h2>Wind</h2>
                <div><span>${weatherStats.wind.speed} mph</span></div>
                <h2>Conditions</h2>
                <div><span>${weatherStats.weather[0].description}</span></div>
            </div>`);
    });


    $.ajax(OPEN_WEATHER_URL_FIVE_DAY, {
        data: {
            APPID: OPEN_WEATHER_APPID, lat: 29.423017, lon: -98.48527, units: "imperial"
        }
    }).done((data) => {
        console.log(data);
        renderFiveDayForecast(data);
    }).fail(console.error);

    // Dynamically render html to DOM for five-day forecast
    const renderFiveDayForecast = ((weatherStats) => {
        weatherStats.list.forEach((day, index) => {
            if (index % 8 === 0) {
                $('#weatherInfo').append(`<div class="weatherCard d-flex flex-column justify-space-around">
                    <h2>${day.dt_txt.slice(0, 10).split('-').reverse().join('/')}</h2>
                    <div><span id="temp">${parseInt(day.main.temp)}&deg;</span></div>
                    <h2>Feels Like</h2>
                    <div><span>${parseInt(day.main.feels_like)}&deg;</span></div>
                    <h2>Humidity</h2>
                    <div><span>${parseInt(day.main.humidity)}%</span></div>
                    <h2>Wind</h2>
                    <div><span>${parseInt(day.wind.speed)} mph</span></div>
                    <h2>Conditions</h2>
                    <div><span>${day.weather[0].description}</span></div>
                </div>`);
            }
        });
    });


    // Map
    // function userInputSearch() {
    //
    //     geocode(userInputBox, MAPBOX_TOKEN).then((data) => {
    //         console.log(data);
    //          map.setCenter(data);
    //         const userInputBoxPopup = new mapboxgl.Popup()
    //             .setHTML(`<p>${userInputBoxSearch}</p>`)
    //         const userInputBoxMarker = new mapboxgl.Marker()
    //             .setLngLat(data)
    //             .addTo(map)
    //             .setPopup(userInputBoxPopup);
    //     })
    //
    //     return new mapboxgl.Map(mapOptions);
    // }


    /*****EVENTS*****/
    //When user types in search
    userInputBox.addEventListener('HTMLInputElement', userInputSearch());

    /*****RUNS WHEN APP LOADS*****/
})();



