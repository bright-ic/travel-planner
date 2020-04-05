import {getDatesDifferenceInDays, getTodaysDate} from "./util";
import {saveTravelPlan, removeTravelPlan, getTripPlansInStorage} from "./storage";
import homeHTML from "../views/home.html";
import tripsHTML from "../views/trips.html";

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/** 
 * @description Helper function that updates ui with travel plans info and weather forcast
 * @param {object} plans - represents key value pairs of different travel/trip plans data
 * @param {string} containerElementId - id of the DOM element to append the dynamicclly created elements to
 * @param {string} from - identifies which part of the code is calling this helper function eg. my trips page or add trip (home page)
*/
export const updateUiWithTravelInfo = async (plans = {}, containerElementId = "", from="") => {
  plans = Object.entries(plans);
  if(plans.length === 0) {
    if(from === "") {
      alert("Nothing to update");
    }
    return;
  }

  let HTML = '';
  let tripDurationHtml  = "";
  for(let plan of plans) {
    const [id, trip] = plan;
    const today = getTodaysDate();
    let travelDepartureDayCount = getDatesDifferenceInDays(today, trip.travelDate);
    let timeToDepartureText = travelDepartureDayCount === 0 ? "today," :  travelDepartureDayCount + (travelDepartureDayCount === 1 ? " day" : " days") + " away,";
    let tripDurationStartingToday = getDatesDifferenceInDays(today, trip.returnDate);
    let actionButton = `<button type="button" class="saveTrip" id="saveTrip" data-id="${trip.id}" data-source="${from}" name="saveTrip" aria-label="Save trip">save trip</button>`;  
    if(from !== "") {
      actionButton = `<button type="button" class="removeTrip"  data-id="${trip.id}" data-source="${from}" name="removeTrip" aria-label="remove trip">remove trip</button>`;
    }
    if(tripDurationStartingToday === 0) {
      tripDurationHtml = `
      <div class="tripDuration">and I will be spending few hours there.</span></div>
      <div class="subHeading">I will also return today</div>`;
    }
    else {
      tripDurationHtml = `
      <div class="tripDuration">and I will be spending ${trip.duration === "" ? 1 : trip.duration} ${trip.duration === "" || parseInt(trip.duration) === 1 ? "day" : "days"} there</div>
      <div class="subHeading returnPeriod">I will be returning on ${trip.returnDate} <span class="tripEndsIn">(${tripDurationStartingToday === 1 ? "tomorrow" : "in " + tripDurationStartingToday + " days time"})</span></div>
      `;
    }

    HTML += `<div class="tripInfoContainer" id="${trip.id}">
    <div class="cityPictureContainer">
        <img class="cityPicture" id="cityPicture" src="${trip.location.image}">
      </div>
      <div class="tripDetailContainer">
        <div class="location heading">My trip to: <span id="tripLocation">${trip.location.city}, ${trip.location.country}</span></div>
        <div class="departureDate heading">Departing: <span id="tripDepartureDate">${trip.travelDate}</span></div>
        <div class="actionButtonContainer">
          ${actionButton}
        </div>
        <div class="tripLoc2Container">My trip to <span id="tripLocation2">${trip.location.city}, ${trip.location.country}</span> is <span class="duration">${timeToDepartureText}</span></div>
        <div class="tripDurationContainer">
          ${tripDurationHtml}
        </div>
        <div class="weatherInfoContainer">
          <div class="subHeading">Typical weather for then is:</div>
          <div class="temp">High - <span id="highTemp">${trip.weather.high_temp}</span> Low - <span id="lowTemp">${trip.weather.low_temp}</span></div>
          <div id="additionalWeatherInfo"> Mostly ${trip.weather.description} throughout the day.</div>
        </div>
      </div>
    </div>`;
  }

  let container = document.getElementById(containerElementId);
  if(container) {
    container.innerHTML = HTML;
    if(from === "") {
      document.querySelector("#saveTrip").addEventListener("click", saveTravelPlan);
    }
    else {
      const removeTripButton = document.querySelectorAll(".removeTrip");
      addClickEventListener(removeTripButton, removeTravelPlan);
    }
  }
  else {
    alert("Error: missing parent node.");
  }
}
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/** 
 * @description helper function that adds either remove trip or save trip buttons to the ui depending on the action performed
 * @param {HTMLElement} target - the button element cliecked
 * @param {string} elclass - class to be assigned to the new created button
 * @param {function} eventHandler - the handler function to be assigned to the new created button click event
 * @param {string} text - the text content of the newly created button
 * @param {string} planID - unique id of the travel plan the target button belongs to
 }}
*/
export const addActionButtonToDOM = (target, elclass, eventHandler, text, planID) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.dataset.id = planID;
  button.classList.add(elclass);
  button.addEventListener("click", eventHandler);
  target.parentNode.appendChild(button);
  target.parentNode.removeChild(target);
}
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**
 * @description Helper function that removes DOM element from the DOM
 * @param {string} elementID - id attribute of the DOM element to be removed.
 */
export const removeElementFromDOM = (elementID) => {
  const ele = document.getElementById(elementID);
  if(ele) {
    ele.remove();
  }
}
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**
 * @description handler function for page links
 * @param {Event} evt - contains information of the event emitted
 */
const pageLoader = (evt) => {
  //evt.preventDefault();
  const targetPage = evt.target.dataset.page;
  loadPage(targetPage);
}
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**
 * @description Hellper function that loads different page depending on the link clicked (target page)
 * @param {string} targetPage - used to determne the page to load
 */
const loadPage = (targetPage) => {
  if(targetPage === "my-trips") {
    document.getElementById("main").innerHTML = tripsHTML;
    document.getElementById("addPlanButton").addEventListener("click", pageLoader);
    // retrieve the saved trips;
    let plans = getTripPlansInStorage() || {};
    updateUiWithTravelInfo(plans, "tripspageContainer", "travel-plan-list");
  }
  else if(targetPage === "home") {
    document.getElementById("main").innerHTML = homeHTML;
  }
  initInteractivity();
}
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**
 * @description Helper function that initializes the flatpickr and add event handler to submit button on each page dynamic laod
 */
const initInteractivity = () => {
  if(document.querySelector(".date")) {
    flatpickr(".date", { mode: "range" });
  }

  if(document.querySelector("#searchForm")) {
    document.querySelector("#searchForm").addEventListener("submit", Client.submitHandler);
  }
}
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**
 * @description helper function that adds click event listener to array of HTMLElements
 * @param {HTMLElements} HTMLNodes - array of htmlelement nodes
 * @param {function} handler - event handler to to be added to the htmlelements click event
 */
const addClickEventListener = (HTMLNodes, handler) => {
  for(let node of HTMLNodes) {
    node.addEventListener("click", handler);
  }
}
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  initInteractivity();

  const links = document.getElementsByTagName('a');
  addClickEventListener(links, pageLoader);

  let targetPage = location.hash.substr(1);
  loadPage(targetPage);
});