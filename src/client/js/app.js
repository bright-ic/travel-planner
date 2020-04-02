
/* Global Variables */
const geonameBaseUrl = "http://api.geonames.org/searchJSON?name_equals=";
const geonameUser = "onwukweb";

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
export const handleSubmit = async (city) => {
   try {
     if(city === "") {
       throw new Error("Please enter city name");
     }
    const res = await getCityLocation(`${geonameBaseUrl}${city}&username=${geonameUser}`);
    console.log(res);
   }
   catch(err) {
    alert(err.message);
   }
}
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */



//Event listeners
document.querySelector("#form").addEventListener("submit", function(event) {
  event.preventDefault();
  const city = document.getElementById("city").value;
  return Client.handleSubmit(city);
  return false;
});