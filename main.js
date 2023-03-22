// LOADER ------------------------------
const loader = document.querySelector(".loader");
document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
    document.querySelector("body").style.visibility = "hidden";
    loader.style.visibility = "visible";
  } else {
    document.querySelector("body").style.visibility = "visible";
    document.body.removeChild(loader);
    loader.style.visibility = "hidden";
  }
};
// End of LOADER ------------------------

const weatherInformationContainer = document.createElement("div");
weatherInformationContainer.setAttribute(
  "class",
  "weather_information_container dark_mode"
);
weatherInformationContainer.innerHTML = `  
        <div class="weather_container_left_panel p-2">
            <div class="weather_container_top_section d-block">
                <div class="weather_title_div">
                  <h1 style="font-weight: 900">Weather Dashboard</h1>
                  <button class="dark_mode_button border-0 rounded-0 mt-2" style="box-shadow: rgba(155, 154, 154, 0.6) 0px 2px 8px 0px; font-weight: 900">Light Mode</button>
                </div>
                <div class="weather_props_units_button_div">
                  <button class="metrics_unit_button border-0 rounded-0 mt-2" style="box-shadow: rgba(155, 154, 154, 0.6) 0px 2px 8px 0px; font-weight: 900">Metric</button>
                  <button class="imperial_unit_button border-0 rounded-0 mt-2" style="box-shadow: rgba(155, 154, 154, 0.6) 0px 2px 8px 0px; font-weight: 900">Imperial</button>
                </div>
              </div>
            <div class="weather_container_time_and_input_div my-2">
                <p data-time-stamp style="font-weight: 900; margin-bottom: 0"></p>
                <input type="text" placeholder="Enter a city OR zip code..." onchange="getWeatherData(this.value)">
            </div>
          <div class="weather_city_and_country_div d-block">
            <h3 data-city></h3>
            <p data-country class="label"></p>
          </div>
          <div class="weather_temperature_data_div">
            <h1 data-current-temperature class="label mb-0"></h1>
            <img src="" alt="Weather" width="100px" height="100px" data-image-url>
            <p data-weather-type class="label mb-1" style="font-weight: 700"></p>
            <p data-max-temp class="label mb-0"></p>
            <p data-min-temp class="label mb-0"></p>
            <p data-feels-like-temperature class="label mb-0"></p>
          </div>
          <div class="cities_div_container mt-4">
            <h5 class="mt-2" style="font-weight: 700; color:#0D9BE5">Forecast in Top 5 Near by Cities for you <i class="fa fa-arrow-right" style="font-size: 14px" aria-hidden="true"></i></h5>
          </div>
        </div>

        <div class="weather_container_right_panel p-1">
                <div class="weather_container_bottom_div">
                  <div class="hourly_updated_weather_title_div" style="color: #0D9BE5">
                      <h6 style="font-weight: 700; margin-bottom: 5px;">Tomorrow's Forecast</h6>
                      <p class="mb-0" color>3-hr interval <i class="fa fa-arrow-right" style="font-size: 14px" aria-hidden="true"></i></p>
                  </div>
              </div>
              <div class="weather_dynamic_props_div_wrapper mt-4">
                <div class="weather_dynamic_props_div">
                    <div class="row mt-2">
                        <div class="weather_humidity weather_props_column p-2" title="Humidity">
                          <h6 data-humidity class="label"></h6>
                          <img src="./img/humidity.png" alt="Humidity">
                        </div>
                        <div class="weather_wind_speed weather_props_column p-2" title="Wind Speed">
                            <h6 data-wind-speed class="label"></h6>
                            <img src="./img/wind_speed.png" alt="Wind Speed">
                        </div>
                        <div class="weather_wind_direction weather_props_column p-2" title="Wind Direction">
                            <h6 data-wind-direction class="label"></h6>
                            <img src="./img/wind_direction.png" alt="Wind Direction">
                        </div>
                        <div class="weather_visibility weather_props_column p-2" title="Visibility">
                            <h6 data-visibility class="label" style="font-size:12px"></h6>
                            <img src="./img/visibility.png" alt="visibility">
                        </div>
                        <div class="weather_sunrise weather_props_column p-2" title="Sunrise">
                            <h6 data-sunrise class="label"></h6>
                            <img src="./img/sunrise.png" alt="Sunrise">
                        </div>
                        <div class="weather_sunset weather_props_column p-2" title="Sunset">
                            <h6 data-sunset class="label"></h6>
                            <img src="./img/sunset.png" alt="Sunset">
                        </div>
                        <div class="weather_cloudiness weather_props_column p-2" title="Cloudiness">
                            <h6 data-cloudiness class="label"></h6>
                            <img src="./img/cloudiness.png" alt="Cloudiness">
                        </div>
                        <div class="weather_dew_point weather_props_column p-2" title="Dew Point">
                            <h6 data-dew-point class="label"></h6>
                            <img src="./img/dew_point.png" alt="Dew Point">
                        </div>
                        <div class="weather_pressure weather_props_column p-2" title="Pressure">
                            <h6 data-pressure class="label"></h6>
                            <img src="./img/pressure.png" alt="Pressure">
                        </div>
                        <div class="weather_air_quality_index weather_props_column p-2" title="Air Quality Index">
                            <h6 data-air-quality-index class="label"></h6>
                            <img src="./img/aqi_index.png" alt="Air Quality Index">
                        </div>
                        <div class="weather_heat_index weather_props_column p-2" title="Heat Index">
                            <h6 data-heat-index class="label"></h6>
                            <img src="./img/heat_index.png" alt="Heat Index">
                        </div>
                    </div>
                </div>
              </div>
        </div>`;
document.body.insertAdjacentElement("afterbegin", weatherInformationContainer);

const developerNoteDiv = document.createElement("div");
developerNoteDiv.setAttribute("class", "developer_note_div dark_mode");
developerNoteDiv.setAttribute(
  "style",
  "position: relative; padding: 10px; font-size: 12px; box-shadow: rgba(155, 155, 155, 0.3) 0px 3px 8px;"
);
developerNoteDiv.innerHTML = `
<div class="developer_note_wrapper p-2 text-center">
<i class="fas fa-times position-absolute p-1 bg-light remove_dev_note_btn" style="top: 0; right: 0; font-size: 1.5rem; color: red; border: 1px solid red; cursor: pointer"></i>
<p class="mb-0 p-1">Our search feature supports both city names and zip codes. To search by city name, enter the desired city's name in the search bar. If you prefer to search by zip code, add the country code along with the code itself. For instance, to find the zip code 75060 in the US, simply enter "75060, US" in the search bar (case-insensitive).</p>
<span style="color: #0D9BE5; font-weight: bold">- Developer's note</span>
</div>
`;
weatherInformationContainer.insertAdjacentElement(
  "beforebegin",
  developerNoteDiv
);

const darkModeButton = document.querySelector(".dark_mode_button");
const removeDevNoteBtn = document.querySelector(".remove_dev_note_btn");
removeDevNoteBtn.addEventListener("click", function () {
  developerNoteDiv.remove();
});

const footer = document.createElement("div");
footer.setAttribute("class", "footer_div dark_mode");
footer.setAttribute(
  "style",
  "flex-direction: column; text-align: center; padding: 0.5rem; box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;"
);
footer.innerHTML = `
    <a href="https://openweathermap.org/" target="_blank" style="color: unset;"><i class="fas fa-bolt" style="color: #0CB0FF"></i> Powered by OpenWeatherMap.org</a>
    <p class="mt-2 mb-0">A big shout out to OpenWeatherMap for this free and easy to use API.</p>
`;
weatherInformationContainer.insertAdjacentElement("afterend", footer);

const metricsUnitButton = document.querySelector(".metrics_unit_button");
const imperialUnitButton = document.querySelector(".imperial_unit_button");

// Some basic encapsulation for ciphering...
function getToken(randomToken) {
  let tokenWithoutRandomKey = randomToken.replace("random", "");
  let token = tokenWithoutRandomKey.split("").reverse().join("");
  return token;
}
const cipherCode1 = getToken("e7b5random03d3");
const cipherCode2 = getToken("4b8frandomb78e");
const cipherCode3 = getToken("9413random053c");
const cipherCode4 = getToken("c1carandomb056");
let cipher;
function sum(arg1, arg2, arg3, arg4) {
  return (cipher = arg1 + arg2 + arg3 + arg4);
}
sum(cipherCode1, cipherCode2, cipherCode3, cipherCode4);

let apiUrl = "";
let unit = "metric";
async function getWeatherData(cityInput, zipCode) {
  if (cityInput) {
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&limit=5&appid=${cipher}&units=${unit}`;
    if (cityInput === "undefined") {
      alert("Sorry, city not found :(");
    }
  } else if (zipCode) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${cipher}`;
  } else {
    // Get a list of cities from the API
    const cityListResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/find?lat=32.7&lon=-96.8&cnt=10&appid=${cipher}`
    );
    const cityListData = await cityListResponse.json();
    // Choose a random city from the list
    const randomCity =
      cityListData.list[Math.floor(Math.random() * cityListData.list.length)];
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${randomCity.id}&appid=${cipher}&units=${unit}`;
  }
  try {
    const response = await fetch(apiUrl);
    const dataFromWeatherAPI = await response.json();
    console.log(dataFromWeatherAPI);
    if (dataFromWeatherAPI.cod === "404") {
      alert("Sorry, the city you entered could not be found :(");
      return;
    }

    // Fetching to get 5 nearby cities around the city searched by the user
    async function getNearByCities() {
      const lat = dataFromWeatherAPI.city.coord.lat;
      const lon = dataFromWeatherAPI.city.coord.lon;
      try {
        const nearbyCitiesApiUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${cipher}&units=${unit}`;
        const response = await fetch(nearbyCitiesApiUrl);
        const dataToGetCities = await response.json();
        const nearbyCities = dataToGetCities.list;
        setNearByCities(nearbyCities);
      } catch (error) {
        console.log("Error", error);
      }
    }

    // Fetching to get data from Air Pollution API
    async function getAirPollutionData() {
      try {
        const lat = dataFromWeatherAPI.city.coord.lat;
        const lon = dataFromWeatherAPI.city.coord.lon;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&cnt=5&appid=${cipher}`
        );
        const dataFromAirPollutionAPI = await response.json();
        // console.log(dataFromAirPollutionAPI);
        setWeatherContainerWithAirPollutionData(dataFromAirPollutionAPI);
      } catch (error) {
        console.log("Error", error);
      }
    }
    setWeatherContainerWithInformation(dataFromWeatherAPI);
    setWeatherContainerWithHourlyUpdates(dataFromWeatherAPI);
    getNearByCities();
    getAirPollutionData();
  } catch (error) {
    console.log("Error: ", error);
  }
}
getWeatherData();

//--------------------------------------------------------------------------

// Declarations for all DOM Objects
const city = document.querySelector("[data-city]");
const country = document.querySelector("[data-country]");
const currentTemperature = document.querySelector("[data-current-temperature]");
const maxTemp = document.querySelector("[data-max-temp]");
const minTemp = document.querySelector("[data-min-temp]");
const weatherType = document.querySelector("[data-weather-type]");
const feelsLikeTemperature = document.querySelector(
  "[data-feels-like-temperature]"
);
const timeSpan = document.querySelector("[data-time-stamp]");
const humidity = document.querySelector("[data-humidity]");
const windSpeed = document.querySelector("[data-wind-speed]");
const windDirection = document.querySelector("[data-wind-direction]");
const visibility = document.querySelector("[data-visibility]");
const sunrise = document.querySelector("[data-sunrise]");
const sunset = document.querySelector("[data-sunset]");
const cloudiness = document.querySelector("[data-cloudiness]");
const dewPoint = document.querySelector("[data-dew-point]");
const aqiIndex = document.querySelector("[data-air-quality-index]");
const pressure = document.querySelector("[data-pressure]");
const heatIndex = document.querySelector("[data-heat-index]");
const imageURL = document.querySelector("[data-image-url");

//--------------------------------------------------------------------------
function setWeatherContainerWithInformation(data) {
  // Calculation using JS CLASS declaration
  const getWeatherFactorsData = new calculateWeatherFactors(
    data.list[0].visibility,
    data.list[0].main.temp,
    data.list[0].main.humidity,
    data.list[0].wind.deg,
    data.list[0].clouds.all
  );
  // DOM Manipulations
  city.innerText = data.city.name;
  country.innerText = `Country: ${data.city.country}`;
  weatherType.innerText = `${data.list[0].weather[0].main} - ${data.list[0].weather[0].description}`;

  // Function to update the DOM elements with the current unit of measurement
  let unit = "C";
  function populateAndSwitchUnitsForWeatherContainer() {
    if (unit === "C") {
      currentTemperature.innerText = `${data.list[0].main.temp} °C`;
      maxTemp.innerText = `Max: ${data.list[0].main.temp_max} °C,`;
      minTemp.innerText = `Min: ${data.list[0].main.temp_min} °C`;
      feelsLikeTemperature.innerText = `Feels Like: ${data.list[0].main.feels_like} °Celsius`;
      windSpeed.innerText = `Wind Speed: ${data.list[0].wind.speed} kmph`;
      // Setting weather visibility information
      const { visibilityInKilometers, visibilityInMiles, visibilityTextLabel } =
        getWeatherFactorsData.getVisibility();
      visibility.innerText = `Visibility: ${visibilityInKilometers}. ${visibilityTextLabel}`;
      // Setting weather dew point information
      dewPoint.innerText = `Dew Point: ${getWeatherFactorsData.getDewPoint()} °C Td`;
      for (let i = 0; i < data.list.length; i++) {
        document
          .querySelectorAll("[data-hourly-update-temp-main]")
          .forEach((mainTemp) => {
            mainTemp.innerText = `${data.list[i].main.temp} °C`;
          });
        document
          .querySelectorAll("[data-hourly-update-temp-max]")
          .forEach((maxTemp) => {
            maxTemp.innerText = `H: ${data.list[i].main.temp_max} °C`;
          });
        document
          .querySelectorAll("[data-hourly-update-temp-min]")
          .forEach((minTemp) => {
            minTemp.innerText = `L: ${data.list[i].main.temp_min} °C`;
          });
      }
    } else {
      currentTemperature.innerText = `${
        convertTemperature(data.list[0].main.temp).tempInFahrenheit
      } °F`;
      maxTemp.innerText = `Max: ${
        convertTemperature(data.list[0].main.temp_max).tempInFahrenheit
      } °F,`;
      minTemp.innerText = `Min: ${
        convertTemperature(data.list[0].main.temp_min).tempInFahrenheit
      } °F`;
      feelsLikeTemperature.innerText = `Feels Like: ${
        convertTemperature(data.list[0].main.feels_like).tempInFahrenheit
      } °Fahrenheit`;
      windSpeed.innerText = `Wind Speed: ${
        convertSpeed(data.list[0].wind.speed).speedInMiles
      } mph`;
      // Setting weather visibility information
      const { visibilityInKilometers, visibilityInMiles, visibilityTextLabel } =
        getWeatherFactorsData.getVisibility();
      visibility.innerText = `Visibility: ${visibilityInMiles}. ${visibilityTextLabel}`;
      dewPoint.innerText = `Dew Point: ${
        convertTemperature(getWeatherFactorsData.getDewPoint()).tempInFahrenheit
      } °F Td`;
      for (let i = 0; i < data.list.length; i++) {
        document
          .querySelectorAll("[data-hourly-update-temp-main]")
          .forEach((mainTemp) => {
            mainTemp.innerText = `${
              convertTemperature(data.list[i].main.temp).tempInFahrenheit
            } °F`;
          });
        document
          .querySelectorAll("[data-hourly-update-temp-max]")
          .forEach((maxTemp) => {
            maxTemp.innerText = `H: ${
              convertTemperature(data.list[i].main.temp_max).tempInFahrenheit
            } °F`;
          });
        document
          .querySelectorAll("[data-hourly-update-temp-min]")
          .forEach((minTemp) => {
            minTemp.innerText = `L: ${
              convertTemperature(data.list[i].main.temp_min).tempInFahrenheit
            } °F`;
          });
      }
    }
  }
  populateAndSwitchUnitsForWeatherContainer();
  // Set up event listeners for the unit buttons
  metricsUnitButton.addEventListener("click", () => {
    imperialUnitButton.style.opacity = 1;
    metricsUnitButton.style.opacity = 0.5;
    unit = "C";
    populateAndSwitchUnitsForWeatherContainer();
  });

  imperialUnitButton.addEventListener("click", () => {
    metricsUnitButton.style.opacity = 1;
    imperialUnitButton.style.opacity = 0.5;
    unit = "F";
    populateAndSwitchUnitsForWeatherContainer();
  });
  //-------------------------------END OF SWITCHING UNITS

  // Setting weather humidity information
  let humidityPercent = data.list[0].main.humidity;
  let humidityTextLabel;
  if (humidityPercent < 20) {
    humidityTextLabel = "Almost no chance of rain today.";
  } else if (humidityPercent > 20 && humidityPercent < 50) {
    humidityTextLabel = "Slight chances of rain today.";
  } else if (humidityPercent > 50 && humidityPercent < 70) {
    humidityTextLabel = "Greater chance of rain today.";
  } else {
    humidityTextLabel = "It's going to rain.";
  }
  humidity.innerText = `Humidity: ${humidityPercent}%. ${humidityTextLabel}`;

  // Setting weather wind speed information
  windDirection.innerText = `Wind Direction: ${getWeatherFactorsData.getWindDirection()}`;

  // Setting weather sunrise and sunset information
  const sunriseTimestamp = data.city.sunrise;
  const sunsetTimestamp = data.city.sunset;
  const currentTimeStamp = getWeatherFactorsData.getTime(new Date());
  const sunriseTime = getWeatherFactorsData.getTime(
    new Date(sunriseTimestamp * 1000)
  );
  const sunsetTime = getWeatherFactorsData.getTime(
    new Date(sunsetTimestamp * 1000)
  );
  timeSpan.innerText = `${currentTimeStamp.currentDayAndTime}`;
  sunrise.innerText = `Sunrise: ${sunriseTime.formattedTimeOnly}`;
  sunset.innerText = `Sunset: ${sunsetTime.formattedTimeOnly}`;

  // Setting weather cloudiness information
  const {
    cloudiness: cloudinessPercent,
    cloudinessTextLabel: cloudinessTextLabel,
  } = getWeatherFactorsData.getCloudiness();
  cloudiness.innerText = `Cloudiness: ${cloudinessPercent}%. \n${cloudinessTextLabel}`;

  // Setting weather heat index information
  const { heatIndex: calculatedHeatIndex, alertText } =
    getWeatherFactorsData.getHeatIndex();
  heatIndex.innerText = `Heat Index: ${
    calculatedHeatIndex ? calculatedHeatIndex : ""
  } \n${alertText}`;

  // Setting weather pressure information
  let pressureTextLabel;
  let pressureInHg = (data.list[0].main.pressure * 0.0295299830714).toFixed(2);
  if (pressureInHg >= 30 && pressureInHg <= 31) {
    pressureTextLabel = "The current pressure is around the average.";
  } else if (pressureInHg > 31) {
    pressureTextLabel = "Conditions are favorable for high pressure.";
  } else {
    pressureTextLabel = "Conditions are favorable for low pressure.";
  }
  pressure.innerText = `Pressure: \n${pressureInHg} inHg. \n${pressureTextLabel}`;

  imageURL.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;

  getWeatherFactorsData.getLabelsColorChanged();
}
//--------------------------------------------------------------------------

// WEIRDEST LEARNING - WOW
// By declaring the weatherUpdateDiv variable outside of the function and setting it to null, you can reference it in the global scope of your code. Then, inside the function, you can assign the value...
function setWeatherContainerWithHourlyUpdates(data) {
  // Setting weather forecast with 3-hrs interval hourly updated with information
  let hourlyUpdatedWeatherDivWrapper = document.createElement("div");
  hourlyUpdatedWeatherDivWrapper.setAttribute(
    "class",
    "hourly_updated_weather_div_wrapper"
  );
  const weatherContainerBottomDiv = document.querySelector(
    ".weather_container_bottom_div"
  );
  const now = new Date();
  const arrayDataLists = data.list;
  for (let i = 0; i < arrayDataLists.length; i++) {
    const lists = arrayDataLists[i];
    const time = lists.dt_txt;
    const forecastTime = new Date(time);
    const diffInDays = Math.floor(
      (forecastTime.getTime(time) - now.getTime(time)) / (1000 * 60 * 60 * 24)
    );

    let forecastTimeLabelDisplay = forecastTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (diffInDays === 0) {
      timeInterval = `Today ${forecastTimeLabelDisplay}`;
    } else if (diffInDays === 1) {
      timeInterval = `Tomorrow ${forecastTimeLabelDisplay}`;
    } else {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayOfWeek = daysOfWeek[forecastTime.getDay()];
      timeInterval = `${dayOfWeek} ${forecastTimeLabelDisplay}`;
    }

    if (forecastTime > now) {
      hourlyUpdatedWeatherDivWrapper.innerHTML += `
    <div class="weather_update_div dark_mode_smaller_div">
      <h6 class="weather_time">${timeInterval}</h6>
      <img src="https://openweathermap.org/img/wn/${lists.weather[0].icon}@2x.png" alt="Weather Type" class="weather_image m-auto" width="40px" height="40px"/>
      <h6 data-hourly-update-temp-main class="weather_temperature">${lists.main.temp} °C</h6>
      <div class="min_max_temperature_container d-flex justify-content-between align-items-center mt-2">
        <p data-hourly-update-temp-max class="label mb-0" style="font-size: 12px">H: ${lists.main.temp_max} °C</p>
        <p data-hourly-update-temp-min class="label mb-0" style="font-size: 12px">L: ${lists.main.temp_min} °C</p>
      </div>
    </div>`;
    }
  }
  // Remove the existing hourlyUpdatedWeatherDivWrapper before adding a new one
  const existingHourlyUpdatedWeatherContainer =
    weatherContainerBottomDiv.querySelector(
      ".hourly_updated_weather_div_wrapper"
    );
  if (existingHourlyUpdatedWeatherContainer) {
    weatherContainerBottomDiv.removeChild(
      existingHourlyUpdatedWeatherContainer
    );
  }
  weatherContainerBottomDiv.appendChild(hourlyUpdatedWeatherDivWrapper);
}
//--------------------------------------------------------------------------

function setWeatherContainerWithAirPollutionData(data) {
  // Setting weather air quality index information
  const { aqiName: aqiName, aqiError: aqiError } = calculateAirQualityIndex(
    data.list[0].components.so2,
    data.list[0].components.no2,
    data.list[0].components.pm10,
    data.list[0].components.pm2_5,
    data.list[0].components.o3,
    data.list[0].components.co
  );

  aqiName === undefined
    ? (aqiIndex.innerHTML = `${aqiError} μg/m3`) &&
      aqiIndex.setAttribute("style", "font-size: 12px")
    : (aqiIndex.innerHTML = `Air Quality: ${aqiName}`);
}
//--------------------------------------------------------------------------

function setNearByCities(data) {
  // Setting top 5 cities in a div when a user queries for a particular city
  const citiesDivWrapper = document.createElement("div");
  citiesDivWrapper.setAttribute("class", "cities_div_wrapper");

  let unit = "C";
  function populateAndSwitchUnitsForNearByCitiesContainer() {
    citiesDivWrapper.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      citiesDivWrapper.innerHTML += `
    <div class="cities_div dark_mode_smaller_div">
      <p data-nearest-city class="label mb-0">${data[i].name}</p><span>${
        data[i].sys.country
      }</span>
      <p data-nearest-city-current-temperature class="label mb-0" style="font-size: 12px">${
        unit === "C"
          ? `${data[i].main.temp} °C`
          : `${convertTemperature(data[i].main.temp).tempInFahrenheit} °F`
      }</p>
      <img src="https://openweathermap.org/img/wn/${
        data[i].weather[0].icon
      }@2x.png" alt="Nearest City" width="40px" height="40px" data-nearest-city-image-url />
      <p data-nearest-city-weather-type class="label mb-0" style="font-size: 12px">${
        data[i].weather[0].main
      } - ${data[i].weather[0].description}</p>
      <p data-nearest-city-max-temp class="label mb-0" style="font-size: 12px">H: ${
        unit === "C"
          ? `${data[i].main.temp_max} °C`
          : `${convertTemperature(data[i].main.temp).tempInFahrenheit} °F`
      }</p>
      <p data-nearest-city-min-temp class="label mb-0" style="font-size: 12px">L: ${
        unit === "C"
          ? `${data[i].main.temp_min} °C`
          : `${convertTemperature(data[i].main.temp_min).tempInFahrenheit} °F`
      }</p>
      <p data-nearest-city-feels-like-temperature class="label mt-0">Feels Like: ${
        unit === "C"
          ? `${data[i].main.feels_like} °C`
          : `${convertTemperature(data[i].main.feels_like).tempInFahrenheit} °F`
      }</p>
    </div>`;
    }
  }
  populateAndSwitchUnitsForNearByCitiesContainer();

  const citiesDivContainer = document.querySelector(".cities_div_container");
  const existingCitiesDivWrapper = citiesDivContainer.querySelector(
    ".cities_div_wrapper"
  );
  if (existingCitiesDivWrapper) {
    citiesDivContainer.removeChild(existingCitiesDivWrapper);
  }
  citiesDivContainer.appendChild(citiesDivWrapper);

  metricsUnitButton.addEventListener("click", () => {
    unit = "C";
    populateAndSwitchUnitsForNearByCitiesContainer();
  });
  imperialUnitButton.addEventListener("click", () => {
    unit = "F";
    populateAndSwitchUnitsForNearByCitiesContainer();
  });
}
//--------------------------------------------------------------------------

// DARK MODE ---------------------------------------------------------------
const weatherPropsColumn = document.querySelectorAll(".weather_props_column");
function setTheme(domElement) {
  if (domElement.classList.contains("dark_mode")) {
    domElement.classList.remove("dark_mode");
    domElement.classList.add("light_mode");
  } else if (domElement.classList.contains("light_mode")) {
    domElement.classList.remove("light_mode");
    domElement.classList.add("dark_mode");
  }
}
let isDarkMode = false;
darkModeButton.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  setTheme(developerNoteDiv);
  setTheme(weatherInformationContainer);
  setTheme(footer);
  darkModeButton.innerText = isDarkMode ? "Dark Mode" : "Light Mode";
});
// END OF DARK MODE--------------------------------------------------------
