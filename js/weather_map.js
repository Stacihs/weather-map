$(() => {
    "use strict";

    /*****GLOBAL VARIABLES*****/
    const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
    const OPEN_WEATHER_URL_FIVE_DAY = "https://api.openweathermap.org/data/2.5/forecast";
    const map = initializeMap();

    /*****FUNCTIONS*****/
    function initializeMap() {
        mapboxgl.accessToken = MAPBOX_TOKEN;

        const mapOptions = {
            container: 'map',
            style: 'mapbox://styles/mapbox/navigation-day-v1',
            center: [-98.491142, 29.424349],
            zoom: 10
        }
        return new mapboxgl.Map(mapOptions);
    }


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

        const marker = new mapboxgl.Marker({
            draggable: true
        }).setLngLat([-98.491142, 29.424349])
            .addTo(map);
    }).fail(console.error);


    $.ajax(OPEN_WEATHER_URL_FIVE_DAY, {
        data: {
            APPID: OPEN_WEATHER_APPID, lat: 29.423017, lon: -98.48527, units: "imperial"
        }
    }).done((data) => {
        console.log(data);
        renderFiveDayForecast(data);
    }).fail(console.error);


    // Dynamically render html to DOM current forecast
    const renderCurrentWeather = ((weatherStats) => {
        $('#weatherInfoCurrent').append(`<div class="weatherCard">
                <div><h1>${weatherStats.name}</h1></div>
                <div class="row justify-space-between">
                    <div class="column align-items">
                        <div><span id="temp">${parseInt(weatherStats.main.temp)}&deg;</span>
                    </div>   
                    <div class="column current2">
                        <h2>Feels Like</h2>
                        <div><span>${parseInt(weatherStats.main.feels_like)}&deg;</span></div>
                        <h2>Humidity</h2>
                        <div><span>${parseInt(weatherStats.main.humidity)}%</span></div> 
                        <h2>Wind</h2>
                        <div><span>${weatherStats.wind.speed} mph</span></div>
                    </div>
                </div>
            </div>`);
    });


    // Dynamically render html to DOM for five-day forecast
    const renderFiveDayForecast = ((weatherStats) => {
        weatherStats.list.forEach((day, index) => {
            if (index % 8 === 0) {
                $('#weatherInfo').append(`<div class="weatherCard">
                    <h2>${day.dt_txt.slice(0, 10).split('-').reverse().join('/')}</h2>
                    <div><span id="temp">${parseInt(day.main.temp)}&deg;</span></div>
                    <h2>Feels Like</h2>
                    <div><span>${parseInt(day.main.feels_like)}&deg;</span></div>
                    <h2>Humidity</h2>
                    <div><span>${parseInt(day.main.humidity)}%</span></div>
                    <h2>Wind</h2>
                    <div><span>${parseInt(day.wind.speed)} mph</span></div>
                  </div>`);
            }
        });
    });


    // User search for different city weather
    function userSearch(e) {
        e.preventDefault();
        let userInput = document.getElementById('place').value;
        geocode(userInput, MAPBOX_TOKEN).then((data) => {
            console.log(data);
            map.setCenter(data);

            $.ajax(OPEN_WEATHER_URL, {
                data: {
                    APPID: OPEN_WEATHER_APPID, lat: data[1], lon: data[0], units: "imperial"
                }
            }).done((data) => {

                console.log('current weather', data);
                $('.weatherCard').remove();
                renderCurrentWeather(data);

                $.ajax(OPEN_WEATHER_URL_FIVE_DAY, {
                    data: {
                        APPID: OPEN_WEATHER_APPID, lat: data[1], lon: data[0], units: "imperial"
                    }
                }).done((data) => {
                    console.log(data);
                    renderFiveDayForecast(data);
                }).fail(console.error);


            }).fail(console.error);

        })

    };

    // userSearch();userSearch
    /*****EVENTS*****/
    //Event listener on submit button
    document.querySelector('button').addEventListener('click', userSearch);

    /*****RUNS WHEN APP LOADS*****/
});



