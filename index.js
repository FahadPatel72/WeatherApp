const usertab = document.querySelector("[data-myweather]");
const searchtab = document.querySelector("[data-searchcityweather]");
const searchbtn = document.querySelector("[data-sbtn]");
const grantaccess = document.querySelector("[data-grantbtn]");
const userContainer = document.querySelector("[data-yourWeather]");
const grantContainer = document.querySelector("[data-grantDataAccess]");
const searchForm = document.querySelector("[data-searchData]");
const searchInput = document.querySelector("[data-searchCity]")
const invalidInput = document.querySelector(".error-page");

const loader = document.querySelector(".loadingcontainer");

console.log("Starting the journey");

const API_KEY = '710b3de439164e82ae0135052240308'; 
console.log("api key fetched")
usertab.classList.add("curr-tab");
let Currtab = usertab;
getfromSessionStorage();

console.log("1")
function switchTab(newTab) { // tum abhi usertab pe the to abhi searchtab ki or
    
    if(newTab!==Currtab){
      Currtab.classList.remove("curr-tab");
      Currtab = newTab;
      Currtab.classList.add("curr-tab");
    }
   
    if(!searchForm.classList.contains("active")){   //hum pehle user tab me the
        
        userContainer.classList.remove("active");
        grantContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{  // hum pehle search tab pr the
          
        searchForm.classList.remove("active");
        userContainer.classList.remove("active");
        getfromSessionStorage();
    }
    invalidInput.classList.remove("active");
}

//usertab 
usertab.addEventListener("click",()=>{
    switchTab(usertab);
})

//searchtab
searchtab.addEventListener("click",()=>{
    switchTab(searchtab);
})
console.log("2")
function getfromSessionStorage(){
    let localcoordinates = sessionStorage.getItem("user-coordinates");

    if(!localcoordinates){
        grantContainer.classList.add("active");
    }
    else{
    const coordinates = JSON.parse(localcoordinates);
    getWeatherInfo(coordinates);
    }
}
console.log("3")
async function getWeatherInfo(coordinates){
    
    const {lat, lon} = coordinates;

    grantContainer.classList.remove("active");

    loader.classList.add("active");

    try{

       const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`);

       const data = await response.json();

       loader.classList.remove("active");
       userContainer.classList.add("active");

       renderedUserInfo(data);
    }
    catch{
        loader.classList.remove("active");
    }

}
console.log("4")
function renderedUserInfo(data){
    
    //fetch all the elements 

    const cityname = document.querySelector("[data-cityName]");
    const flag = document.querySelector("[data-flag]");
    const description = document.querySelector("[data-description]");
    const icon = document.querySelector("[ data-cloudsicon]");
    const weather = document.querySelector("[data-weather]");
    const windspeed = document.querySelector("[data-fetchSpeed]");
    const humidity = document.querySelector("[data-fetchhumidity]");
    const cloud = document.querySelector("[data-fetchClouds]");

    console.log("City name fetched");
    cityname.innerText = `${data.location.name}`;
    flag.src = `https://flagcdn.com/144x108/${data.location.country.toLowerCase().slice(0,2)}.png`;
    description.innerText =  `${data.current.condition.text}`;
    icon.src = `https:${data.current.condition.icon}`;
    weather.innerText = `${data.current.temp_c} °C`;
    windspeed.innerText = `${data.current.wind_mph} m/s`;
    humidity.innerText = `${data.current.humidity}%`;
    cloud.innerText = `${data.current.cloud}%`;
    
}
console.log("5")
function getlocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getposition);
    }
    else{
        alert("Geo Location not found");
    }
}
console.log("6")
function getposition(position){

    const usercoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude
    };

    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    getWeatherInfo(usercoordinates);
}
console.log("7")
//grant access button to fetch current location
grantContainer.addEventListener("click",getlocation);
console.log("8")
//search city
searchForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName===""){
        return;
    }

    else{
        searchWeatherInfo(cityName);
    }

});
console.log("9")
async function searchWeatherInfo(cityName) {
    
    loader.classList.add("active");
    grantContainer.classList.remove("active");
    userContainer.classList.remove("active");

    
    //API CALL

    try{

        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`);


        if (!res.ok) {
        throw new Error('City not found');
        }

        const info = await res.json();

        loader.classList.remove("active");

        userContainer.classList.add("active");

        renderedUserInfo(info);

    }
    catch(e){
       console.log(e);
       show404Error();
    }

}
console.log("all done")

function show404Error() {
    loader.classList.remove("active");
    invalidInput.classList.add("active");
}