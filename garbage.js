const citiesDivWrapper = document.createElement("div");
citiesDivWrapper.setAttribute("class", "cities_div_wrapper");
function setNearByCities(data) {
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
}
