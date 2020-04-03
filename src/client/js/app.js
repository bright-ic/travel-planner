import flatpickr from "flatpickr";
/* Global Variables */
const geonameBaseUrl = "http://api.geonames.org/searchJSON?name_equals=";
const geonameUser = "onwukweb";
const weatherbitAPIKey = "a959d468804d4901aa8ee5e1a731cad0";
const weatherbitBaseUrl = "https://api.weatherbit.io/v2.0/forecast/daily/";
const pixabayAPIKey = "15874403-07fd84fc7635618793667fd9a";
const pixabayBaseUrl = "https://pixabay.com/api/";
import noCityPicture from "../media/cloud.jpg";

const projectData = {};

// helper function that searches for city using geoname api
const getCityLocation = async (url) => {
  let response = { error: false, message: "", lat: "", lng: "", data: null };
  try {
    let res = await fetch(url);
    res = await res.json();
    const data = res.geonames.length > 0 ? res.geonames : null;
    response.message = "success";
    response.data = data !== null ? data[0] : data;
    response.lat = response.data !== null ? response.data.lat : "";
    response.lng = response.data !== null ? response.data.lng : "";
    return response;
  }
  catch (err) {
    return { ...response, error: true, message: err.message };
  }
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// helper function that retrieves future weather forcast
const getWeatherForcast = async (baseUrl, lat, lng, startDate, endDate, key, departureDayCount, tripDuration) => {
  let response = { error: false, message: '', data: null, departureDay: 1 };
  try {
    departureDayCount = parseInt(departureDayCount);
    // only i6 days into the future weather can be retrieved
    if (departureDayCount > 16) {
      throw new Error("Sorry! We can only get weather forcast for the next 16 days.");
    }
    tripDuration = tripDuration !== "" && tripDuration > 0 ? parseInt(tripDuration) : 0;
    let dday = departureDayCount;
    if (departureDayCount < 1) {
      if (startDate === endDate) {
        departureDayCount = 1;
        response.departureDay = 0;
      }
      else {
        departureDayCount = tripDuration + 1;
        response.departureDay = 0;
      }
    }
    else {
      departureDayCount = departureDayCount + 1 + tripDuration;
      response.departureDay = dday;
    }
    let res = await fetch(`${baseUrl}?lat=${lat}&lon=${lng}&days=${departureDayCount}&key=${key}`);
    res = await res.json();
    response.data = typeof res.data !== "undefined" && Array.isArray(res.data) && res.data.length > 0 ? res.data : null;
    response.message = "success";
    return response;
  }
  catch (err) {
    return { ...response, error: true, message: err.message };
  }
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// helper function that retrieves future weather forcast
const getPhotoOfCity = async (baseUrl, key, city) => {
  let response = { error: false, message: '', data: null };
  try {
    const url = `${baseUrl}?key=${key}&image_type=photo&q=${encodeURIComponent(city)}&orientation=vertical`;
    let res = await fetch(url);
    res = await res.json();
    response.data = res.totalHits > 0 ? res.hits[0] : null;
    response.message = "success";
    return response;
  }
  catch (err) {
    return { ...response, error: true, message: err.message };
  }
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// helper function that handles form submission
export const handleSubmit = async (city, date) => {
  try {
    if (city === "") {
      throw new Error("Please enter city name");
    }
    if (date === "") {
      throw new Error("Pick a travel date");
    }

    let tripDate = getTripDate(date); // get the travel start date and [end return date if a range is selected]
    let today = getTodaysDate();
    let travelDepartureDayCount = getDatesDifferenceInDays(today, tripDate.travelDate);
    // check if user's departing date is in the past.
    if (travelDepartureDayCount < 0) {
      throw new Error("Your planned departure date has passed. Pick another date");
    }

    const cityLocation = await getCityLocation(`${geonameBaseUrl}${city}&username=${geonameUser}`);
    if (cityLocation.error) {
      throw new Error(cityLocation.message);
    }
    if (cityLocation.lat === "" && cityLocation.lng === "") {
      throw new Error("Sorry! We could not find the city you're planning to travel to.");
    }
    if (tripDate.travelDate === "") {
      throw new Error("Sorry! We can not process your request without a travel departure date.");
    }
    tripDate.returnDate = tripDate.returnDate === "" ? tripDate.travelDate : tripDate.returnDate; // defualt return date to same date as departure date if user does not provide return date
    const weatherData = await getWeatherForcast(weatherbitBaseUrl, cityLocation.lat, cityLocation.lng, tripDate.travelDate, tripDate.returnDate, weatherbitAPIKey, travelDepartureDayCount, tripDate.duration);
    const photoOfCityData = await getPhotoOfCity(pixabayBaseUrl, pixabayAPIKey, city);

    // updating the ui
    let dayOfDepartureWeather = { high_temp: '', low_temp: '', weather: { description: '' } };
    if (weatherData.error) {
      alert(weatherData.message);
    }
    else {
      dayOfDepartureWeather = weatherData.data[weatherData.departureDay];
    }
    let timeToDepartureText = travelDepartureDayCount === 0 ? "today," :  travelDepartureDayCount + (travelDepartureDayCount === 1 ? " day" : " days") + " away,";
    const cityImage = photoOfCityData.data !== null ? photoOfCityData.data.webformatURL : noCityPicture;

    let tripDurationHtml  = "";
    let tripDurationStartingToday = getDatesDifferenceInDays(today, tripDate.returnDate);
    if(tripDurationStartingToday === 0) {
      tripDurationHtml = `
      <div class="tripDuration">and I will be spending few hours there.</span></div>
      <div class="subHeading">I will also return today</div>`;
    }
    else {
      tripDurationHtml = `
      <div class="tripDuration">and I will be spending ${tripDate.duration === "" ? 1 : tripDate.duration} ${tripDate.duration === "" || parseInt(tripDate.duration) === 1 ? "day" : "days"} there</div>
      <div class="subHeading returnPeriod">I will be returning on ${tripDate.returnDate} <span class="tripEndsIn">(${tripDurationStartingToday === 1 ? "tomorrow" : "in " + tripDurationStartingToday + " days time"})</span></div>
      `;
    }
    let html = `<div class="tripInfoContainer">
    <div class="cityPictureContainer">
      <img class="cityPicture" id="cityPicture" src="${cityImage}">
    </div>
    <div class="tripDetailContainer">
      <div class="location heading">My trip to: <span id="tripLocation">${cityLocation.data.name}, ${cityLocation.data.countryName}</span></div>
      <div class="departureDate heading">Departing: <span id="tripDepartureDate">${tripDate.travelDate}</span></div>
      <div class="actionButtonContainer">
        <button type="button" class="saveTrip" id="saveTrip" name="saveTrip" aria-label="Save trip">save trip</button>
        <button type="button" class="removeTrip" id="removeTrip" name="removeTrip" aria-label="Remove trip">remove trip</button>
      </div>
      <div class="tripLoc2Container">My trip to <span id="tripLocation2">${cityLocation.data.name}, ${cityLocation.data.countryName}</span> is <span class="duration">${timeToDepartureText}</span></div>
      <div class="tripDurationContainer">
        ${tripDurationHtml}
      </div>
      <div class="weatherInfoContainer">
        <div class="subHeading">Typical weather for then is:</div>
        <div class="temp">High - <span id="highTemp">${dayOfDepartureWeather.high_temp}</span> Low - <span id="lowTemp">${dayOfDepartureWeather.low_temp}</span></div>
        <div id="additionalWeatherInfo"> Mostly ${dayOfDepartureWeather.weather.description} throughout the day.</div>
      </div>
    </div>
  </div>`;
    document.getElementById("pageContent").innerHTML = html;

    // console.log("trip dates", tripDate);
    // console.log("City location, ", cityLocation);
    // console.log("weather data,", weatherData);
    // console.log("Your departure day is due in: " + travelDepartureDayCount);
    // console.log("photos of city, ", photoOfCityData);
    return;
  }
  catch (err) {
    alert(err.message);
    return;
  }
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// Helper function that gets the users travel duration
// const getTravelDuration = (startDate, endDate) => {
//   // To set two dates to two variables 
//   const date1 = new Date(startDate);
//   const date2 = new Date(endDate);

//   let Difference_In_Time = date2.getTime() - date1.getTime();
//   let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
//   return Difference_In_Days;
// }
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// Helper function that gets number of days to users departure date
const getDatesDifferenceInDays = (startDate, endDate) => {
  const dateObj1 = new Date(startDate);
  const dateObj2 = new Date(endDate);

  let Difference_In_Time = dateObj2.getTime() - dateObj1.getTime();
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days;
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
const getTodaysDate = () => {
  let today = new Date();
  return today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
const getTripDate = (tdate) => {
  const trip = { travelDate: "", returnDate: "", duration: "" };
  if (tdate === "") {
    return null;
  }

  trip.travelDate = tdate;
  if (tdate.indexOf("to") > 0) {
    const datesArr = tdate.split(" ");
    trip.travelDate = datesArr[0];
    trip.returnDate = datesArr[2];
    trip.duration = getDatesDifferenceInDays(trip.travelDate, trip.returnDate); // get travel duration
  }
  return trip;
}


document.addEventListener("DOMContentLoaded", function () {
  flatpickr(".date", { mode: "range" });
})