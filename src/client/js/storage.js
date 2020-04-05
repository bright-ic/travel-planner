import {addActionButtonToDOM, removeElementFromDOM} from "./DOM";

/**
 * @description Helper function that initiates the saving of travel plan to local storage
 * @param {Event} evt - the information of the event triggered
 */
export const saveTravelPlan = (evt) => {
  const target = evt.target;
  const planID = target.dataset.id;
  if(planID == "undefined" || typeof planID === "undefined" || planID == "") {
    alert("Sorry! Something went wrong while trying to process your request.");
    return;
  }
  const plan = Client.projectData.travelPlans[planID];
  if(addItemToStorage(plan)) {
    alert("Save successfully!");
    // add remove trip button to the ui and remove "save trip" button from the ui
    addActionButtonToDOM(target, "removeTrip", removeTravelPlan, "remove trip", planID);
  }
  else {
    alert("Sorry! Something went wrong while processing your request.");
  }
}

/**
 * @description Helper function that removes travel plan from localstorage
 * @param {Event} evt - holds the information of the event triggered and element that triggered it
 */
export const removeTravelPlan = (evt) => {
  const target = evt.target;
  const planID = target.dataset.id;
  const source = target.dataset.source;
  if(planID == "undefined" || typeof planID === "undefined" || planID == "") {
    alert("Sorry! Something went wrong while trying to process your request.");
    return;
  }
  let plans = getDataInStorage("travelPlan");
  if(plans === null) {
    alert("Nothing to remove");
    return false;
  }

  try {
    if(typeof plans[planID] !== "undefined") {
      delete plans[planID];
    }
    else {
      alert("Item does not exist");
      return;
    }
    // add to storage
    const updatedPlan = JSON.stringify(plans);
    localStorage.setItem("travelPlan", updatedPlan);
    // add save trip button to the ui and remove "remove trip" button from the ui
    addActionButtonToDOM(target, "saveTrip", saveTravelPlan, "save trip", planID);
    alert("Removed successfully!");
    if(source === "travel-plan-list") {
      removeElementFromDOM(planID);
    }
  }
  catch (err) {
    alert(err.message);
  }
}

/**
 * @description Helper function that adds travel plan to localstorage
 * @param {object} plan - contains details of the travel plan to add to local storage
 * @returns {boolean} true on success or false on failure
 */
const addItemToStorage = (plan) => {
  if(!window.localStorage) {
    alert("Sorry! We could not process your request. It seems like you are using an old browser");
    return false;
  }
  let plans = getDataInStorage("travelPlan");
  if(plans === null) {
    plans = {};
  }
  plans[plan.id] = plan;

  try {
    // add to storage
    const updatedPlan = JSON.stringify(plans);
    localStorage.setItem("travelPlan", updatedPlan);
    return true;
  }
  catch (err) {
    alert(err.message);
    return false;
  }
}

/**
 * @description Helper function that retrieves travels plans from localstorage (ie plans that were saved before)
 * @param {string} key - contains the key of the item to be retrieved from localstorage
 * @returns {object} on success
 * @returns {null} on failure
 */
export const getDataInStorage = (key) => {
  let data = localStorage.getItem(key);
  if(data === null) {
    data = null;
  }
  else {
    data = JSON.parse(data);
  }

  return data;
}

/**
 * @description Helper function that initiates the retrieval of all travel plans stored in localstorage
 */
export const getTripPlansInStorage = () => {
  return getDataInStorage("travelPlan");
}