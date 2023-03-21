/* ------------------------------------------------------------------------ */
// Calculate visibility, dew point, heat index
class calculateWeatherFactors {
  constructor(amount, temperature, humidity, windDegree, cloudiness) {
    this.amount = amount;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windDegree = windDegree;
    this.cloudiness = cloudiness;
  }

  getVisibility = () => {
    const amountInKilometers = this.amount / 1000;
    const amountInMiles = this.amount / 1000 / 1.609344;
    const visibilityInKilometers = `${parseFloat(amountInKilometers).toFixed(
      2
    )} kms`;
    const visibilityInMiles = `${parseFloat(amountInMiles).toFixed(2)} mi`;

    let visibilityTextLabel;
    if (visibilityInMiles < 6 || visibilityInKilometers < 10) {
      visibilityTextLabel =
        "There may be reduced visibility due to atmospheric obstructions.";
    } else {
      visibilityTextLabel =
        "The wind speed is high enough to reduce the impact of atmospheric obstructions on visibility.";
    }
    return { visibilityInKilometers, visibilityInMiles, visibilityTextLabel };
  };

  // Magnus-Tetens approximation, which is widely used to calculate dew point.
  getDewPoint = () => {
    const a = 17.27;
    const b = 237.7;
    const dewPoint =
      (a * this.temperature) / (b + this.temperature) +
      Math.log(this.humidity / 100);
    const dewPointTemperature = (b * dewPoint) / (a - dewPoint);
    return dewPointTemperature.toFixed(2);
  };

  getHeatIndex = () => {
    const c1 = -42.379;
    const c2 = -2.04901523;
    const c3 = -10.14333127;
    const c4 = -0.22475541;
    const c5 = -0.00683783;
    const c6 = -0.05481717;
    const c7 = -0.00122874;
    const c8 = 0.00085282;
    const c9 = -0.00000199;

    const T = this.temperature;
    const RH = this.humidity;

    const heatIndex =
      c1 +
      c2 * T +
      c3 * RH +
      c4 * T * RH +
      c5 * T * T +
      c6 * RH * RH +
      c7 * T * T * RH +
      c8 * T * RH * RH +
      c9 * T * T * RH * RH;

    let alertText;
    if (heatIndex < 0) {
      alertText = "Temperature is too low to calculate the heat index.";
    } else if (heatIndex < 32) {
      alertText = "No precautions needed.";
    } else if (heatIndex >= 32 && heatIndex < 40) {
      alertText = "Use caution.)";
    } else if (heatIndex >= 40 && heatIndex < 54) {
      alertText = "Take precautions.";
    } else if (heatIndex >= 54 && heatIndex < 66) {
      alertText = "Take extra precautions.";
    } else {
      alertText = "Avoid all outdoor activities.";
    }
    return heatIndex < 0 ? { alertText } : { heatIndex, alertText };
  };

  // Wind direction to text words
  getWindDirection = () => {
    const windDirText =
      this.windDegree >= 337.5 || this.windDegree < 22.5
        ? "North"
        : this.windDegree >= 22.5 && this.windDegree < 67.5
        ? "Northeast"
        : this.windDegree >= 67.5 && this.windDegree < 112.5
        ? "East"
        : this.windDegree >= 112.5 && this.windDegree < 157.5
        ? "Southeast"
        : this.windDegree >= 157.5 && this.windDegree < 202.5
        ? "South"
        : this.windDegree >= 202.5 && this.windDegree < 247.5
        ? "Southwest"
        : this.windDegree >= 247.5 && this.windDegree < 292.5
        ? "West"
        : this.windDegree >= 292.5 && this.windDegree < 337.5
        ? "Northwest"
        : "";
    return windDirText;
  };

  // Convert Unix timestamp to JavaScript Date object
  getTime = (time) => {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    const amOrPm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedTimeOnly = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${amOrPm}`;

    // array of weekday names
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    // Getting the current day of the week
    const dayOfWeek = weekdays[time.getDay()];
    const currentDayAndTime = `${dayOfWeek}, ${hours}:${minutes} ${amOrPm}`;
    return {
      currentDayAndTime: currentDayAndTime,
      formattedTimeOnly: formattedTimeOnly,
    };
  };

  getCloudiness = () => {
    let cloudiness = this.cloudiness;
    let cloudinessTextLabel;
    if (cloudiness < 20) {
      cloudinessTextLabel = "Mostly clear skies.";
    } else if (cloudiness >= 20 && cloudiness < 50) {
      cloudinessTextLabel = "Partly cloudy skies.";
    } else if (cloudiness >= 50 && cloudiness < 80) {
      cloudinessTextLabel = "Mostly cloudy skies.";
    } else {
      cloudinessTextLabel = "Overcast skies.";
    }
    return { cloudiness, cloudinessTextLabel };
  };

  getLabelsColorChanged = () => {
    const labels = document.querySelectorAll(".label");
    labels.forEach((label) => {
      const colonIndex = label.innerText.indexOf(":");
      if (colonIndex !== -1) {
        label.innerHTML = `<span style='font-weight: 900'>${label.innerText.substring(
          0,
          colonIndex
        )}</span>${label.innerText.substring(
          colonIndex,
          label.innerText.length
        )}`;
      }
    });
  };
}
/* ------------------------------------------------------------------------ */

// Calculate air quality index
function calculateAirQualityIndex(so2, no2, pm10, pm2_5, o3, co) {
  const AQI_CATEGORIES = [
    {
      name: "Good",
      so2: [0, 20],
      no2: [0, 40],
      pm2_5: [0, 20],
      pm10: [0, 10],
      o3: [0, 60],
      co: [0, 4400],
    },
    {
      name: "Fair",
      so2: [20, 80],
      no2: [40, 70],
      pm2_5: [10, 25],
      pm10: [20, 50],
      o3: [60, 100],
      co: [4400, 9400],
    },
    {
      name: "Moderate",
      so2: [80, 250],
      no2: [70, 150],
      pm2_5: [25, 50],
      pm10: [50, 100],
      o3: [100, 140],
      co: [9400, 12400],
    },
    {
      name: "Poor",
      so2: [250, 350],
      no2: [150, 200],
      pm2_5: [50, 75],
      pm10: [100, 200],
      o3: [140, 180],
      co: [12400, 15400],
    },
    {
      name: "Very Poor",
      so2: [350, Infinity],
      no2: [200, Infinity],
      pm2_5: [75, Infinity],
      pm10: [200, Infinity],
      o3: [180, Infinity],
      co: [15400, Infinity],
    },
  ];

  // Check which AQI category the pollutant concentrations fall into
  let aqiName;
  let aqiError;
  for (const category of AQI_CATEGORIES) {
    if (
      so2 >= category.so2[0] &&
      so2 <= category.so2[1] &&
      no2 >= category.no2[0] &&
      no2 <= category.no2[1] &&
      pm2_5 >= category.pm2_5[0] &&
      pm2_5 <= category.pm2_5[1] &&
      pm10 >= category.pm10[0] &&
      pm10 <= category.pm10[1] &&
      o3 >= category.o3[0] &&
      o3 <= category.o3[1] &&
      co >= category.co[0] &&
      co <= category.co[1]
    ) {
      aqiName = category.name;
      console.log(aqiName);
      break;
    }
    aqiError = `Could not find AQI category for this value, SO2: ${so2}, NO2: ${no2}, PM10: ${pm10}, PM25: ${pm2_5}, O3:${o3}, CO:${co}`;
  }
  return { aqiName, aqiError };
}

// Convert temperature from celsius to fahrenheit or vice versa
convertTemperature = (temperature) => {
  let tempInCelsius = ((temperature - 32) / 1.8).toFixed(2);
  let tempInFahrenheit = (temperature * 1.8 + 32).toFixed(2);
  return { tempInCelsius, tempInFahrenheit };
};

// Convert speed from mph to kph or vice versa
convertSpeed = (speed) => {
  let speedInKilometers = (speed * 1.609).toFixed(2);
  let speedInMiles = (speed / 1.609).toFixed(2);
  return { speedInMiles, speedInKilometers };
};

// ---------END OF WEATHER_CLASS>JS

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
// End of Loader ------------------------

const weatherInformationContainer = document.createElement("div");
weatherInformationContainer.setAttribute(
  "class",
  "weather_information_container"
);
weatherInformationContainer.innerHTML = `  
        <div class="weather_container_left_panel p-2">
            <div class="weather_container_top_section d-block">
                <div class="weather_title_div">
                  <h1 style="font-weight: 900">Weather Dashboard</h1>
                </div>
                <div class="weather_props_units_button_div">
                  <button class="metrics_unit_button border-0 rounded-0 mt-2" style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; font-weight: 900">Metric</button>
                  <button class="imperial_unit_button border-0 rounded-0 mt-2" style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; font-weight: 900">Imperial</button>
                </div>
              </div>
            <div class="weather_container_time_and_input_div d-flex justify-content-between align-items-center m-2">
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
            <h5 class="mt-2" style="font-weight: 700; color:#0D9BE5">Forecast in Top 5 Near by Cities for you</h5>
          </div>
        </div>

        <div class="weather_container_right_panel p-1">
              
                <div class="weather_container_bottom_div">
                <div class="hourly_updated_weather_title_div" style="color: #0D9BE5">
                    <h6 style="font-weight: 700; margin-bottom: 5px;">Tomorrow's Forecast</h6>
                    <p class="mb-0" color>3-hr interval</p>
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
                            <h6 data-visibility class="label"></h6>
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
developerNoteDiv.setAttribute("class", "developer_note_div");
developerNoteDiv.setAttribute(
  "style",
  "position: relative; background-color: #3c3b3f; padding: 10px; font-size: 12px; box-shadow: rgba(255, 255, 255, 0.24) 0px 3px 8px;"
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

const removeDevNoteBtn = document.querySelector(".remove_dev_note_btn");
removeDevNoteBtn.addEventListener("click", function () {
  developerNoteDiv.remove();
});

const footer = document.createElement("div");
footer.setAttribute("class", "footer_div");
footer.setAttribute(
  "style",
  "flex-direction: column; background-color: #3c3b3f; text-align: center; padding: 0.5rem; box-shadow: rgba(255, 255, 255, 0.24) 0px 3px 8px;"
);
footer.innerHTML = `
    <a href="https://openweathermap.org/" target="_blank" style="color: unset;"><i class="fas fa-bolt" style="color: #0CB0FF"></i> Powered by OpenWeatherMap.org</a>
    <p class="mt-2 mb-0">A big shout out to OpenWeatherMap for this free and easy to use API.</p>
`;
weatherInformationContainer.insertAdjacentElement("afterend", footer);

const metricsUnitButton = document.querySelector(".metrics_unit_button");
const imperialUnitButton = document.querySelector(".imperial_unit_button");

const API_Key = "3d305b7ee87bf8b4c3503149650bac1c";
let apiUrl = "";
let unit = "metric";
async function getWeatherData(cityInput, zipCode) {
  if (cityInput) {
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&limit=5&appid=${API_Key}&units=${unit}`;
    if (cityInput === "undefined") {
      alert("Sorry, city not found :(");
    }
  } else if (zipCode) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${API_Key}`;
  } else {
    // Get a list of cities from the API
    const cityListResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/find?lat=32.7&lon=-96.8&cnt=10&appid=${API_Key}`
    );
    const cityListData = await cityListResponse.json();
    // Choose a random city from the list
    const randomCity =
      cityListData.list[Math.floor(Math.random() * cityListData.list.length)];
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${randomCity.id}&appid=${API_Key}&units=${unit}`;
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
    let nearbyCities;
    async function getNearByCities() {
      const lat = dataFromWeatherAPI.city.coord.lat;
      const lon = dataFromWeatherAPI.city.coord.lon;
      try {
        const nearbyCitiesApiUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${API_Key}&units=${unit}`;
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
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&cnt=5&appid=${API_Key}`
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

function setWeatherContainerWithHourlyUpdates(data) {
  // Setting weather forecast with 3-hrs interval hourly updated with information
  let hourlyUpdatedWeatherDiv = document.createElement("div");
  hourlyUpdatedWeatherDiv.setAttribute(
    "class",
    "hourly_updated_weather_div_wrapper"
  );
  const weatherContainerBottomDiv = document.querySelector(
    ".weather_container_bottom_div"
  );
  const now = new Date();
  const lists = data.list;
  // const list = lists[i];
  for (let i = 0; i < lists.length; i++) {
    const list = lists[i];
    const time = lists[i].dt_txt;
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
      hourlyUpdatedWeatherDiv.innerHTML += `
    <div class="weather_update_div">
      <h6 class="weather_time">${timeInterval}</h6>
      <img src="https://openweathermap.org/img/wn/${list.weather[0].icon}@2x.png" alt="Weather Type" class="weather_image m-auto" width="40px" height="40px"/>
      <h6 data-hourly-update-temp-main class="weather_temperature">${list.main.temp} °C</h6>
      <div class="min_max_temperature_container d-flex justify-content-between align-items-center mt-2">
        <p data-hourly-update-temp-max class="label mb-0" style="font-size: 12px">H: ${list.main.temp_max} °C</p>
        <p data-hourly-update-temp-min class="label mb-0" style="font-size: 12px">L: ${list.main.temp_min} °C</p>
      </div>
    </div>
  `;
    }
  }
  // Remove the existing hourlyUpdatedWeatherDiv before adding a new one
  const existingHourlyUpdatedWeatherContainer =
    weatherContainerBottomDiv.querySelector(
      ".hourly_updated_weather_div_wrapper"
    );
  if (existingHourlyUpdatedWeatherContainer) {
    weatherContainerBottomDiv.removeChild(
      existingHourlyUpdatedWeatherContainer
    );
  }
  weatherContainerBottomDiv.appendChild(hourlyUpdatedWeatherDiv);
}
setWeatherContainerWithHourlyUpdates();
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
setWeatherContainerWithAirPollutionData();
//--------------------------------------------------------------------------

function setNearByCities(data) {
  // Setting top 5 cities in a div when a user queries for a particular city
  const citiesDivWrapper = document.createElement("div");
  citiesDivWrapper.setAttribute("class", "cities_div_wrapper");

  let unit = "C";

  function update() {
    citiesDivWrapper.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      citiesDivWrapper.innerHTML += `
    <div class="cities_div">
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
  update();

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
    update();
  });

  imperialUnitButton.addEventListener("click", () => {
    unit = "F";
    update();
  });
}
//-----------------------------------END OF MAIN.JS
