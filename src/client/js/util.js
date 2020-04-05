/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**
 * @description Helper function that gets the difference in days between two dates
 * @param {string} startDate - a date string less than endDate
 * @param {string} endDate - a future date
 * @returns {number} the difference in days between two dates
 */
export const getDatesDifferenceInDays = (startDate, endDate) => {
  const dateObj1 = new Date(startDate);
  const dateObj2 = new Date(endDate);

  let Difference_In_Time = dateObj2.getTime() - dateObj1.getTime();
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days;
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**
 * @description A function that returns the current date in this format yyyy-mm-dd
 * @returns {string} date string
 */
export const getTodaysDate = () => {
  let today = new Date();
  return today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**
 * @description Helper function that returns travel departure date, return date and travel duration based on the users selected dates
 * @param {string} tdate - contains dates of departure and/or return date eg "2020-04-06" or "2020-04-6 to 2020-04-12"
 * @param {function} getDuration  function that returns the trip duration based on the trip departure date and return date
 * @returns {object} containing departure date, return date and trip duration on success
 * @returns {null} on failure
 */
export const getTripDate = (tdate, getDuration) => {
  const trip = { travelDate: "", returnDate: "", duration: "" };
  if (tdate === "") {
    return null;
  }

  trip.travelDate = tdate;
  if (tdate.indexOf("to") > 0) {
    const datesArr = tdate.split(" ");
    trip.travelDate = datesArr[0];
    trip.returnDate = datesArr[2];
    trip.duration = getDuration(trip.travelDate, trip.returnDate); // get travel duration
  }
  return trip;
}