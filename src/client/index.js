import { handleSubmit } from './js/app';
import "./styles/resets.scss";
import "./styles/base.scss";
import "./styles/footer.scss";
import "./styles/form.scss";
import "./styles/header.scss";
import "./styles/tripInfo.scss";
import "./styles/flatpickr.min.scss";
import cityPicture from "./media/city_sample.jpg";

document.getElementById("cityPicture").src = cityPicture;

export {
  handleSubmit
}