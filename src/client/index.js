import { handleSubmit, projectData } from './js/app';
import { removeTravelPlan} from "./js/storage";
import {updateUiWithTravelInfo} from "./js/DOM";
import "./styles/resets.scss";
import "./styles/base.scss";
import "./styles/footer.scss";
import "./styles/form.scss";
import "./styles/header.scss";
import "./styles/tripInfo.scss";
import "./styles/flatpickr.min.scss";

let isSubmitting = false;

//Event listeners
document.querySelector("#searchForm").addEventListener("submit", function (event) {
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
  Client.handleSubmit(city, date)
  .then(() => {
    isSubmitting = false;
    searchButton.textContent = "Go";
  })
  .catch(() => {
    isSubmitting = false;
    searchButton.textContent = "Go";
  })
  return false;
});

export {
  handleSubmit,
  projectData
}