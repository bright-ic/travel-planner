import {addActionButtonToDOM, removeElementFromDOM} from "./DOM";

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