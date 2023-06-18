function fetchWeatherData() {
    const locationInput = document.getElementById('location-input');
    const location = locationInput.value;
    const apiKey = 'ad65b10fe8ffdd0396789c7bc837c08e';
    const url = '';

    if (location) {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Nairobi&appid=${apiKey}&units=metric`;
    }

    fetchWeather(apiUrl);
}

function fetchWeatherDataByLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const apiKey = 'ad65b10fe8ffdd0396789c7bc837c08e';
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

            fetchWeather(apiUrl);
          },
          error => {
            const weatherContainer = document.getElementById('weather-data');
            weatherContainer.innerHTML = '<p>Unable to retrieve location.</p>';
          }
        );
      } else {
        const weatherContainer = document.getElementById('weather-data');
        weatherContainer.innerHTML = '<p>Geolocation is not supported by your browser.</p>';
      }
    }

    function fetchWeather(apiUrl) {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const weatherContainer = document.getElementById('weather-data');
          if (data.cod === '404') {
            weatherContainer.innerHTML = `<p>${data.message}</p>`;
          } else {
            const temperatureUnit = getTemperatureUnit();
            const windSpeedUnit = getWindSpeedUnit();
            const temperature = data.main.temp;
            const windSpeed = data.wind.speed;
            const windDirection = data.wind.deg;

            let formattedTemperature = temperature;
            if (temperatureUnit === 'imperial') {
              formattedTemperature = (temperature * 9/5) + 32;
            }

            let formattedWindSpeed = windSpeed;
            if (windSpeedUnit === 'imperial') {
              formattedWindSpeed = windSpeed * 0.621371;
            }

            const windDirectionText = getWindDirectionText(windDirection);

            weatherContainer.innerHTML = `
              <p>Location: ${data.name}</p>
              <p>Temperature: ${formattedTemperature.toFixed(1)}°</p>
              <p>Weather: ${data.weather[0].description}</p>
              <p>Wind Speed: ${formattedWindSpeed.toFixed(1)} ${windSpeedUnit === 'imperial' ? 'mph' : 'km/h'}</p>
              <p>Wind Direction: ${windDirectionText}</p>
              <p>Humidity: ${data.main.humidity}%</p>
            `;

            updateBackgroundImage(data.weather[0].main);
          }
        })
        .catch(error => {
          const weatherContainer = document.getElementById('weather-data');
          weatherContainer.innerHTML = '<p>Failed to fetch weather data.</p>';
        });
    }

    function updateBackgroundImage(weatherCondition) {
      const bodyElement = document.body;
      let imageUrl = '';

      switch (weatherCondition) {
        case 'Clear':
          imageUrl = 'clear.jpg';
          break;
        case 'Clouds':
          imageUrl = 'clouds.jpg';
          break;
        case 'Rain':
        case 'Drizzle':
          imageUrl = 'rain.jpg';
          break;
        case 'Thunderstorm':
          imageUrl = 'thunderstorm.jpg';
          break;
        case 'Snow':
          imageUrl = 'snow.jpg';
          break;
        default:
          imageUrl = 'default.jpg';
      }

      bodyElement.style.backgroundImage = `url(${imageUrl})`;
    }

    function getTemperatureUnit() {
      const celsiusRadio = document.getElementById('celsius');
      if (celsiusRadio.checked) {
        return celsiusRadio.value;
      } else {
        return document.getElementById('fahrenheit').value;
      }
    }

    function getWindSpeedUnit() {
      const kilometersRadio = document.getElementById('kilometers');
      if (kilometersRadio.checked) {
        return kilometersRadio.value;
      } else {
        return document.getElementById('miles').value;
      }
    }

    function getWindDirectionText(windDirection) {
      const directions = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
      ];
      const index = Math.round(windDirection / 22.5) % 16;
      return directions[index];
    }

    fetchWeatherData();




