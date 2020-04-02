import flatpickr from "flatpickr";
/* Global Variables */
const geonameBaseUrl = "http://api.geonames.org/searchJSON?name_equals=";
const geonameUser = "onwukweb";
const weatherbitAPIKey = "a959d468804d4901aa8ee5e1a731cad0";
const weatherbitBaseUrl = "https://api.weatherbit.io/v2.0/history/daily?lat=38.123&lon=-78.543&start_date=2020-03-29&end_date=2020-03-30&start_date=2020-03-29&end_date=2020-03-30&key=API_KEY"

const projectData = {};

// helper function that searches for city using geoname api
const getCityLocation = async (url) => {
  let response = {error:false, message:'', data:null};
  try {
    let res = await fetch(url);
    res = await res.json();
    const data = res.geonames || null;
    response.message = "success";
    response.data = data !== null ? data[0] : data;
    return response;
  }
  catch (err) {
    return {...response, error:true, message: err.message};
  }
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// helper function that handles form submission
export const handleSubmit = async (city, date) => {
   try {
     if(city === "") {
       throw new Error("Please enter city name");
     }
     if(date === "" ) {
        throw new Error("Pick a travel date");
      }
     
    let tripDate = getTripDate(date); // get the travel start date and [end return date if a range is selected]
    console.log("trip dates",tripDate);

      const res = await getCityLocation(`${geonameBaseUrl}${city}&username=${geonameUser}`);
      console.log(res);
   }
   catch(err) {
    alert(err.message);
   }
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
// Helper function that gets the users travel duration
const getTravelDuration = (startDate, endDate) => {
    // To set two dates to two variables 
    const date1 = new Date(startDate); 
    const date2 = new Date(endDate); 

    let Difference_In_Time = date2.getTime() - date1.getTime(); 
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
const getTripDate = (tdate) => {
  const trip = {travelDate:'', returnDate:'', duration:''};
  if(tdate === "") {
    return null;
  }

  trip.travelDate = tdate;
  if(tdate.indexOf("to") > 0) {
    const datesArr = tdate.split(" ");
    trip.travelDate = datesArr[0];
    trip.returnDate = datesArr[2];
    trip.duration = getTravelDuration(trip.travelDate, trip.returnDate); // get travel duration
  }
  return trip;
}


//Event listeners
document.querySelector("#form").addEventListener("submit", function(event) {
  event.preventDefault();
  const city = document.getElementById("city").value;
  let date = document.getElementById("startDate").value;
  return Client.handleSubmit(city, date);
  return false;
});

document.addEventListener("DOMContentLoaded", function() {
  flatpickr(".date", {mode:"range"});

    console.log("dom is ready");
})