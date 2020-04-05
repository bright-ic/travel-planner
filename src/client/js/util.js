import {getDataInStorage} from "./storage";
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// Helper function that gets number of days to users departure date
export const getDatesDifferenceInDays = (startDate, endDate) => {
  const dateObj1 = new Date(startDate);
  const dateObj2 = new Date(endDate);

  let Difference_In_Time = dateObj2.getTime() - dateObj1.getTime();
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days;
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
export const getTodaysDate = () => {
  let today = new Date();
  return today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
export const getTripDate = (tdate) => {
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

export const getTripPlansInStorage = () => {
  return getDataInStorage("travelPlan");
}