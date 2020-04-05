import {getDatesDifferenceInDays, getTodaysDate} from "./util";
import {saveTravelPlan} from "./storage";

export const updateUiWithTravelInfo = async (plans = {}, travelDepartureDayCount) => {
  if(plans.length === 0) {
    alert("Nothing to update");
    return;
  }
  
  let HTML = '';
  let tripDurationHtml  = "";
  for(let plan of Object.entries(plans)) {
    const trip = plan[1];
    const today = getTodaysDate();
    let travelDepartureDayCount = getDatesDifferenceInDays(today, trip.travelDate);
    let timeToDepartureText = travelDepartureDayCount === 0 ? "today," :  travelDepartureDayCount + (travelDepartureDayCount === 1 ? " day" : " days") + " away,";
    let tripDurationStartingToday = getDatesDifferenceInDays(today, trip.returnDate);
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

    HTML += `<div class="tripInfoContainer">
    <div class="cityPictureContainer">
        <img class="cityPicture" id="cityPicture" src="${trip.location.image}">
      </div>
      <div class="tripDetailContainer">
        <div class="location heading">My trip to: <span id="tripLocation">${trip.location.city}, ${trip.location.country}</span></div>
        <div class="departureDate heading">Departing: <span id="tripDepartureDate">${trip.travelDate}</span></div>
        <div class="actionButtonContainer">
          <button type="button" class="saveTrip" id="saveTrip" data-id="${trip.id}" name="saveTrip" aria-label="Save trip">save trip</button>
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

  document.getElementById("pageContent").innerHTML = HTML;
  document.querySelector("#saveTrip").addEventListener("click", saveTravelPlan);
}
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
//helper function that adds either remove trip or save trip buttons to the ui depending on the action performed
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
// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  if(document.querySelector(".date")) {
    flatpickr(".date", { mode: "range" });
  }
});