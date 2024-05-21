const input = document.querySelector(".find-location");
const city = document.querySelector("#city");
const cityName = document.querySelector(".location");
const Temp = document.querySelector(".num");
const main = document.querySelector("#main");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const image = document.querySelector(".forecast-icon img");

// Elements for today's weather
const todayDay = document.querySelector('.today .day');
const todayDate = document.querySelector('.today .date');

input.onsubmit = (e) => {
  e.preventDefault();
  weatherUpdate(city.value);
  city.value = "";
};

function weatherUpdate(city) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=e53732ad44c72bb08f6c2c140d3bfdfb&units=metric`
  );

  xhr.send();
  xhr.onload = () => {
    if (xhr.status === 404) {
      alert("Place not found");
    } else if (xhr.status === 200) {
      const data = JSON.parse(xhr.response);

      // Display current weather data
      cityName.innerHTML = data.city.name;
      Temp.innerHTML = `${Math.round(data.list[0].main.temp)}°C`;
      main.innerHTML = data.list[0].weather[0].main;
      image.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
      humidity.innerHTML = `Humidity: ${data.list[0].main.humidity}%`;
      wind.innerHTML = `Wind Speed: ${data.list[0].wind.speed}m/s`;

      // Update day and date for today's weather
      const currentDate = new Date(data.list[0].dt * 1000);
      todayDay.innerHTML = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      todayDate.innerHTML = currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

      // Update forecast for the next 5 days (8 * 3-hour intervals = 24 hours)
      const forecastElements = document.querySelectorAll('.forecast');
      for (let i = 1; i <= 5; i++) {
        const forecastIndex = i * 8; // 8 * 3-hour intervals for each subsequent day
        const forecast = forecastElements[i];
        const forecastData = data.list[forecastIndex];

        forecast.querySelector('.day').innerHTML = new Date(forecastData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
        forecast.querySelector('.date').innerHTML = new Date(forecastData.dt * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        forecast.querySelector('.degree').innerHTML = `${Math.round(forecastData.main.temp)}<sup>o</sup>C`;
        forecast.querySelector('.forecast-icon img').src = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;
        forecast.querySelector('.temp').innerHTML = `Day - ${Math.round(forecastData.main.temp_max)}&#176;C<br>Night - ${Math.round(forecastData.main.temp_min)}&#176;C`;
        forecast.querySelector('.humidity').innerHTML = `Humidity: ${forecastData.main.humidity}%`;
        forecast.querySelector('.wind').innerHTML = `Wind Speed: ${forecastData.wind.speed}m/s`;
      }
    } else {
      alert("An error occurred while fetching the weather data.");
    }
  };
}

// Initial call to update the weather for a default city
weatherUpdate("Kharar");
