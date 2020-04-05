import flatpickr from "flatpickr";
import {getDatesDifferenceInDays, getTripDate, getTodaysDate} from "./util";
import {updateUiWithTravelInfo} from "./DOM";
import noCityPicture from "../media/cloud.jpg";
/* Global Variables */
const geonameBaseUrl = "http://api.geonames.org/searchJSON?name_equals=";
const geonameUser = "onwukweb";
const weatherbitAPIKey = "a959d468804d4901aa8ee5e1a731cad0";
const weatherbitBaseUrl = "https://api.weatherbit.io/v2.0/forecast/daily/";
const pixabayAPIKey = "15874403-07fd84fc7635618793667fd9a";
const pixabayBaseUrl = "https://pixabay.com/api/";

export const projectData = {
  travelPlans: {}
};

let isSubmitting = false;

/**  
 * @description helper function that searches for city using geoname api
 * @param {string} url - url of the geoname api including the api key etc.
 * @returns {object} city location data
*/
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
/**  
 * @description helper function that retrieves future weather forcast
 * @param {string} baseUrl - base url of the weatherbit api
 * @param {string} lat - latitude (of the location/position of the city)
 * @param {string} lng - longitude (of the location/position of the city)
 * @param {string} startDate - travel departure date
 * @param {string} endDate - travel return date
 * @param {string} key - weathebit API key
 * @param {number} departureDayCount - number of days to departure day/date calculated form current date.
 * @param {number} tripDuration - the duration of the trip
 * @returns {object} on success weather forcast data eg {error:false, message:"success", data:{...}, departureDat:number}
 * @returns {object} on failure  eg {error:true, message:"....", data:null, departureDat:1}
*/
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
/**
 * @description helper function that fetches the picture of the city/country the user is traveling to using pixabay api
 * @param {string} baseUrl - base url of pixabay api (required)
 * @param {string} key - pixabay API key (required)
 * @param {string} city - city the user is plaining to travel to (required)
 * @param {string} country - the country the city is located in
 * @returns {object} photo of the city
*/
export const getPhotoOfCity = async (baseUrl, key, city, country) => {
  let response = { error: false, message: '', data: null };
  try {
    let isCountryPhotoSearched = false;
    let url = `${baseUrl}?key=${key}&image_type=photo&q=${encodeURIComponent(city)}&orientation=vertical`;
    let res = await fetch(url);
    res = await res.json();
    response.data = res.totalHits > 0 ? res.hits[0] : null;
    if(response.data === null && !isCountryPhotoSearched) { // no photo was returned for the city user selected
      // search for a any photo of the county
      isCountryPhotoSearched = true;
      url = `${baseUrl}?key=${key}&image_type=photo&q=${encodeURIComponent(country)}&orientation=vertical`;
      res = await fetch(url);
      res = await res.json();
      response.data = res.totalHits > 0 ? res.hits[0] : null;
    }
    response.message = "success";
    return response;
  }
  catch (err) {
    return { ...response, error: true, message: err.message };
  }
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**
 * @description helper function that processes form submission
 * @param {string} city - city the user is traveling to [form field]
 * @param {string} date - date of departure and/or return date
*/
const handleSubmit = async (city, date) => {
  try {
    if (city === "") {
      throw new Error("Please enter city name");
    }
    if (date === "") {
      throw new Error("Pick a travel date");
    }

    let tripDate = getTripDate(date, getDatesDifferenceInDays); // get the travel start date and [end return date if a range is selected]
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
    const photoOfCityData = await getPhotoOfCity(pixabayBaseUrl, pixabayAPIKey, city, cityLocation.data.countryName);

    // updating the ui
    let dayOfDepartureWeather = { high_temp: '', low_temp: '', weather: { description: '' } };
    if (weatherData.error) {
      alert(weatherData.message);
    }
    else {
      dayOfDepartureWeather = weatherData.data[weatherData.departureDay];
    }
    const cityImage = photoOfCityData.data !== null ? photoOfCityData.data.webformatURL : noCityPicture;

    // prepare the travel plan data to added to the project data
    const plan = {
      id: Date.now(),
      ...tripDate,
      location: {
        city: cityLocation.data.name,
        country : cityLocation.data.countryName,
        lat: cityLocation.lat,
        lng: cityLocation.lng,
        image: cityImage
      },
      weather: {
        high_temp: dayOfDepartureWeather.high_temp,
        low_temp: dayOfDepartureWeather.low_temp,
        description: dayOfDepartureWeather.weather.description
      }
    }

    //add the new travel plan to the project data;
    projectData.travelPlans = {};
    projectData.travelPlans[plan.id] = plan;

    updateUiWithTravelInfo(projectData.travelPlans, "pageContent");
    return;
  }
  catch (err) {
    alert(err.message);
    return;
  }
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
export const submitHandler = (event) => {
    event.preventDefault();
    // ensure that multiple form submission is avoided
    if(isSubmitting) {
        return false;
    }
    isSubmitting = true;
    const city = document.getElementById("city").value;
    let date = document.getElementById("startDate").value;
    let searchButton = document.getElementById("searchButton");
    searchButton.textContent = "processing...";
    handleSubmit(city, date)
    .then(() => {
      isSubmitting = false;
      searchButton.textContent = "Go";
    })
    .catch(() => {
      isSubmitting = false;
      searchButton.textContent = "Go";
    })
    return false;
}