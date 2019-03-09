import $ from 'jQuery';

/**
 * create geo Button
 */
export const launchGeo = () => {
    $("#geoButton").bind("click", geoFindMe);
};


// export const initApi = () => {
var geoApiKey = "CVeTSHSiqKJeyUcYGb5obi1U8dHs4CiT";
var mapApiKey = "Ao5zDDDjMrx5Rq0Seln9pIweBYqKmo0jmIUheKZTdKOrUCieKVc0xMzSL82fhMVz";
var polApiKey = "ad83532c2a47c98d570950fc8954f4b1ce4a8cf4";
// }



/**
 * create pin icon
 */
export const pageBuild = () => {
    var spinner = window.document.getElementById("spinner");
    spinner.setAttribute("style", "display:none");
    var geoIcon = window.document.querySelector("#geoIcon");
    var i = window.document.createElement("img");
    i.setAttribute("class", "col");
    i.setAttribute("alt", "logo.png");
    i.setAttribute("src", "src/assets/images/logo.png");
    i.setAttribute("style", "width:150px");

    geoIcon.appendChild(i);

    $("#geoIcon").bind("click", createInput);
    $("#polButton").bind("click", polFindMe);
    $("#geoNavBut").bind("click", geoFindMe);
    $("#polNavBut").bind("click", polFindMe);

}
/**
 * Find Coordinates
 * lat,long
 */
export const geoFindMe = () => {

    var spinner = window.document.querySelector("#spinner");
    spinner.setAttribute("style", "display:visible");

    setTimeout(function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            var spinner = window.document.getElementById("spinner");
            spinner.setAttribute("style", "display:none");
            getCityCodeByPos(position.coords.latitude, position.coords.longitude);
            createMap(position.coords.latitude, position.coords.longitude);
        });
    }, 1500);
};


export const polFindMe = () => {

    var spinner = window.document.querySelector("#spinner");
    spinner.setAttribute("style", "display:visible");

    setTimeout(function () {
        navigator.geolocation.getCurrentPosition(function (position) {

            GetPollutionIndex(position.coords.latitude, position.coords.longitude);
        });
    }, 1500);
};


/**
 * Get City code by Position
 * @param {string} lat 
 * @param {string} long 
 * @returns {string} LocalInfos
 */
export const getCityCodeByPos = (lat, long) => {
    var xhr = new XMLHttpRequest;
    var url = "http://dataservice.accuweather.com" + "/locations/v1/cities/geoposition/search?apikey=" + geoApiKey + "&q=" + lat + "%2C" + long + "&language=fr-FR HTTP/1.1";
    xhr.open("GET", url);
    var body = new FormData;
    body.append("url", url);
    xhr.send(body);
    xhr.onload = function (event) {
        if (200 === xhr.status) {
            getWeather(xhr.responseText);
            getLight(xhr.responseText);

        }
    };

};


/**
 * Get Weather Infos From City Code
 * @param {string} reponse //localInfos
 * to be parsed to get CityCode
 */
export const getWeather = (reponse) => {
    var xhr2 = new XMLHttpRequest;
    var cityCode = JSON.parse(reponse).ParentCity.Key;
    var url = "http://dataservice.accuweather.com" + "/forecasts/v1/daily/1day/" + cityCode + "?apikey=" + geoApiKey + "&language=fr-FR&metric=true";
    xhr2.open("GET", url);
    var body = new FormData;
    body.append("url", url);
    xhr2.send(body);
    xhr2.onload = function (event) {
        if (200 === xhr2.status) {
            displayTemps(xhr2.responseText, reponse);

        }
    };
};

/**
 * Get Light from CityCode
 */
export const getLight = (reponse) => {
    var xhr3 = new XMLHttpRequest;
    var cityCode = JSON.parse(reponse).ParentCity.Key;
    var url = "http://dataservice.accuweather.com" + "/currentconditions/v1/" + cityCode + "?apikey=" + geoApiKey + "&language=fr-FR HTTP/1.1";
    xhr3.open("GET", url);
    var body = new FormData;
    body.append("url", url);
    xhr3.send(body);
    xhr3.onload = function (event) {
        if (200 === xhr3.status) {
            displayNight(xhr3.responseText);
        }
    };
};


/**
 * Create Div For Light Infos
 * @param {*} reponse 
 */
export const displayNight = (reponse) => {
    var day = JSON.parse(reponse).IsDayTime;
    if (day) {
        $("body").css("background-color", "#0d47a1");
        $("body").css("color", "white");
    }
    else {
        $("body").css("background-color", "#1976d2");

    }
}

/**
 * Create Infos from AJAX
 * @param {string} weather 
 * @param {string} city 
 */
export const displayTemps = (weather, city) => {

    var CountryName = JSON.parse(city).Country.LocalizedName;
    var RegionyName = JSON.parse(city).AdministrativeArea.LocalizedName;
    var localName = JSON.parse(city).LocalizedName;
    var cityName = JSON.parse(city).ParentCity.LocalizedName;
    var temps = JSON.parse(weather).DailyForecasts;
    var headlines = JSON.parse(weather).Headline.Text;
    var ciel = JSON.parse(weather).DailyForecasts;
    var cielD = ciel[0].Day.IconPhrase;
    var cielN = ciel[0].Night.IconPhrase;
    var minFullTemp = temps[0].Temperature.Minimum.Value;
    var maxFullTemp = temps[0].Temperature.Maximum.Value;
    $("#geoCoord").text("Ville : " + cityName);
    $("#geoCoord2").text("Pays : " + CountryName + " - Région : " + RegionyName + "  - Quartier : " + localName);
    $("#temp").text("Min : " + minFullTemp + "- Max : " + maxFullTemp);
    var iconUrl = "src/assets/images/icons/";
    var iconDayUrl = iconUrl + JSON.parse(weather).DailyForecasts[0].Day.Icon + "-s.png";
    var iconNightUrl = iconUrl + JSON.parse(weather).DailyForecasts[0].Night.Icon + "-s.png";

    $("#ciel").append(
        $("<p>").text("Jour : ").append(
            $("<img>").attr("src", iconDayUrl)));
    $("#ciel").append(
        $("<p>").text("Nuit : ").append(
            $("<img>").attr("src", iconNightUrl)));
    // .text("Jour : " + cielD + " - Nuit : " + cielN));
    $("#headlines").text(headlines);
}

/**
 * 
 */

export const createInput = () => {
    var searchCityForm = window.document.querySelector("#searchCityForm");
    searchCityForm.style = "display:visible";
    $("#searchCityForm").bind("submit", searchCityInputFunc);
}

export const createMap = (lat, long) => {

    var map = document.getElementById('map');
    var mapUrl = "https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/" + lat + "," + long + "/15?mapSize=500,500&;22&key=" + mapApiKey;
    map.setAttribute("src", mapUrl);
    var geoCooDiv = window.document.querySelector("#geoCooDiv");
    var p = window.document.createElement("p");
    var pText = window.document.createTextNode(`Ma localisation :  ${lat} ${long}`);
    p.appendChild(pText);
    map.appendChild(p);
}

export const GetPollutionIndex = (lat, long) => {
    var xhr = new XMLHttpRequest;
    var url = "http://api.waqi.info/feed/geo:" + lat + ";" + long + "/?token=" + polApiKey;
    xhr.open("GET", url);
    var body = new FormData;
    body.append("url", url);
    xhr.send(body);
    xhr.onload = function (event) {
        if (200 === xhr.status) {
            var spinner = window.document.getElementById("spinner");
            spinner.setAttribute("style", "display:none");
            displayPollution(xhr.responseText);
        }
    };

}

export const displayPollution = (reponse) => {
    var main = window.document.querySelector("#main");
    var aqi = "Indice de pollution : " + JSON.parse(reponse).data.aqi;
    var aqiTown = "Station située à : " + JSON.parse(reponse).data.city.name;
    var aqiTime = "Prélevement à : " + (JSON.parse(reponse).data.time.s).slice(-8, -3);
    var aqiSource = "Prélevement par : " + JSON.parse(reponse).data.attributions[0].name;
    var polArray = [];
    polArray.push(aqi, aqiSource, aqiTime, aqiTown)
    var ul = window.document.createElement("ul");
    main.appendChild(ul);
    ul.setAttribute("class", "list-group justify-content-center");
    for (let value of polArray) {
        var li = window.document.createElement("li");
        // var p = window.document.createElement("p");
        var polText = window.document.createTextNode(value)
        li.setAttribute("class", "list-group-item bg-info text-white");
        li.appendChild(polText);
        ul.appendChild(li);
    }
    var img = window.document.createElement("img");
    img.setAttribute("src", "src/assets/images/air-legend.png");
    img.setAttribute("width", "500px");
    img.setAttribute("class", "justify-content-center");
    main.appendChild(img);




}

/**
 * 
 * @param {*} event 
 */
export const searchCityInputFunc = (event) => {
    event.preventDefault();
    var searchCityInput = window.document.querySelector("#searchCityInput");
    var townQuery = searchCityInput.value;
    getCityCodeFromName(townQuery);
}


/**
 * 
 * @param {string} cityName 
 * @returns cityCode
 */
export const getCityCodeFromName = (cityName) => {
    var xhr4 = new XMLHttpRequest;
    var url = "http://dataservice.accuweather.com" + "/locations/v1/cities/search?apikey=" + geoApiKey + "&q=" + cityName + "&language=fr-FR HTTP/1.1";
    xhr4.open("GET", url);
    var body = new FormData;
    body.append("url", url);
    xhr4.send(body);
    xhr4.onload = function (event) {
        if (200 === xhr4.status) {
            getWeather(xhr4.responseText);
            getLight(xhr4.responseText);
        }
    };

};


