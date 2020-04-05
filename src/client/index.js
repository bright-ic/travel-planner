import { submitHandler, projectData } from './js/app';
import { removeTravelPlan} from "./js/storage";
import {updateUiWithTravelInfo} from "./js/DOM";
import "./styles/resets.scss";
import "./styles/base.scss";
import "./styles/footer.scss";
import "./styles/form.scss";
import "./styles/header.scss";
import "./styles/tripInfo.scss";
import "./styles/flatpickr.min.scss";

//Event listeners
if(document.querySelector("#searchForm")) {
  document.querySelector("#searchForm").addEventListener("submit", submitHandler);
}

export {
  submitHandler,
  projectData
}