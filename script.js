let cityInput = document.getElementById("city_input")
let searchBtn = document.getElementById("searchBtn")
let locationBtn = document.getElementById("locationBtn")
let api_key = "e4675c0924aade01698d5671f6ba031f"
let currentWeatherCard = document.querySelectorAll(".weather-left .card")[0]
let fiveDaysForecastCard = document.querySelector(".day-forecast")
let aqiCard = document.querySelectorAll(".hightlights .card")[0]
let aqiList = ["Good" , "Fair" , "Moderate" , "Poor" , "Very Poor"]
let sunRiseCard = document.querySelectorAll(".hightlights .card")[1]
let humidityVal = document.getElementById("humidityVal")
let pressureVal = document.getElementById("pressureVal")
let visibilityVal = document.getElementById("visibilityVal")
let windspeedVal = document.getElementById("windspeedVal")
let feelsVal = document.getElementById("feelsVal")
let hourlyForecastCard = document.querySelector(".hourly-forecast")



function  getWeatherDetails(name , lat , lon , country , state){
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
    let AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
    let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]
    axios.get(AIR_POLLUTION_API_URL)
    .then(function (response) {
        let {co , no , no2 , o3 , so2 , pm2_5 , pm10 , nh3} = response.data.list[0].components
        aqiCard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${response.data.list[0].main.aqi}">${aqiList[response.data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-solid fa-wind fa-3x"></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                </div>

                <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                </div>

                <div class="item">
                    <p>SO2</p>
                    <h2>${so2}</h2>
                </div>

                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>

                <div>
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>

                <div>
                    <p>NO2</p>
                    <h2>${no2}</h2>
                </div>

                <div>
                    <p>NH3</p>
                    <h2>${nh3}</h2>
                </div>

                <div>
                    <p>O3</p>
                    <h2>${o3}</h2>
                </div>
            </div>
        `
    })
    .catch(function (error) {
        // handle error
        console.log(error)
})

    axios.get(WEATHER_API_URL)
        .then(function (response) {
            let date = new Date()
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(response.data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${response.data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p class="te"><i class="fa-solid fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                    <p class="te"><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
                </div>
            `
            let {sunrise , sunset} = response.data.sys
            let {timezone, visibility} = response.data
            let {humidity, pressure , feels_like} = response.data.main
            let {speed} = response.data.wind
            let sRiseTime = moment.utc(sunrise, "X").add(timezone, "seconds").format("hh:mm A")
            let sSetTime = moment.utc(sunset, "X").add(timezone, "seconds").format("hh:mm A")
            sunRiseCard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa-regular fa-sun fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-solid fa-sun fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>
            `
            humidityVal.innerHTML = `${humidity}%`
            pressureVal.innerHTML = `${pressure}hpa`
            visibilityVal.innerHTML = `${visibility / 1000}km`
            windspeedVal.innerHTML = `${speed}m/s`
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`
            // console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            alert(`Failed to get current weather`)
    })


    axios.get(FORECAST_API_URL)
        .then(function (response) {
            let hourlyForecast = response.data.list
            hourlyForecastCard.innerHTML = ""
            for(i = 0; i < 7; i++){
                let hrForecastDate = new Date(hourlyForecast[i].dt_txt)
                let hr = hrForecastDate.getHours()
                let a = "PM"
                if(hr < 12) a = "AM"
                if(hr == 12) a = "AM"
                if(hr > 12){
                    hr = hr - 12
                    a = "PM"
                }
                hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png">
                    <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
                `
            }
            let uniqueForecastDays = []
            let fiveDaysForecast = response.data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate()
                if(!uniqueForecastDays.includes(forecastDate)){
                    return uniqueForecastDays.push(forecastDate)
                }
            })
            fiveDaysForecastCard.innerHTML = ""
            for(i = 1; i < fiveDaysForecast.length; i++){
                let date = new Date(fiveDaysForecast[i].dt_txt)
                fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                        <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()}, ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
                `
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error)
            alert(`Failed to get weather forecast`)
    })

}


function getCityCoordinates(){
    let cityName = cityInput.value
    cityInput.value = ""
    if(!cityName) return
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`


    axios.get(GEOCODING_API_URL)
        .then(function (response) {
        let {name , lat , lon , country , state} = response.data[0]
        getWeatherDetails(name , lat , lon , country , state)
        })
        .catch(function (error) {
        alert(`Failed to get the coordinates of ${cityName}`)
    })
}


searchBtn.addEventListener("click", getCityCoordinates)

locationBtn.addEventListener("click" , getUserCoordinates)

function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`
        // console.log(latitude , longitude)


        axios.get(REVERSE_GEOCODING_URL)
        .then(function (response) {
            // console.log(response.data)
            let {name , country , state} = response.data[0]
            getWeatherDetails(name , latitude , longitude , country , state)
        })
        .catch(function (error) {
            alert(`Failed to get user coordinates`)
        })

    }, error => {
        if(error.code == error.PERMISSION_DENIED){
            alert("Access Denied to Your Location. Please Allow Access To Your Location")
        }
    })
}


cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates())
window.addEventListener("load",getUserCoordinates)