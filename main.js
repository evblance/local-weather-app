formatTime = function (time) {
    var year = time.getFullYear();
    var month = ("0" + (time.getMonth() + 1)).slice(-2);
    var date = ("0" + time.getDate()).slice(-2);
    var hours = ("0" + time.getHours()).slice(-2);
    var minutes = ("0" + time.getMinutes()).slice(-2);
    
    return year + "/" + month + "/" + date + " @ " + hours + ":" + minutes;
};

getCity = function (json) {
    return json.list[0].name;
};

getTemperature = function (json) {
    var temperature = json.list[0].main.temp;
    return Math.round(temperature);
};

getHumidity = function (json) {
    return json.list[0].main.humidity;
};

getPressure = function (json) {
    var pressure = json.list[0].main.pressure;
    return Number(pressure).toFixed(1);
};

getConditions = function (json) {
    return json.list[0].weather[0].main;
};

getConditionsIcon = function (json) {
    // returns the icon associated with the conditions, which can be accessed via
    // http://openweathermap.org/img/w/<icon>.png
    return json.list[0].weather[0].icon;
};

getWindSpeed = function (json) { 
    var speed = json.list[0].wind.speed;
    return Number(speed * 3.6).toFixed(1);
};

getWindDirection = function (json) {
    
    var degrees = json.list[0].wind.deg;
    
    if (degrees >= 337.5 || degrees <= 22.4) {
        return "N";
    } else if (degrees >= 22.5 && degrees <= 67.4) {
        return "NE";
    } else if (degrees >= 67.5 && degrees <= 112.4) {
        return "E";
    } else if (degrees >= 112.5 && degrees <= 157.4) {
        return "SE";
    } else if (degrees >= 157.5 && degrees <= 202.4) {
        return "S";
    } else if (degrees >= 202.5 && degrees <= 247.4) {
        return "SW";
    } else if (degrees >= 247.5 && degrees <= 292.4) {
        return "W";
    } else if (degrees >= 292.5 && degrees <= 337.4) {
        return "NW";
    } else {
        console.log("Error: Could not map the wind direction to a string!");
    }
};

geolocationFailure = function () {
     alert("App failed to retrieve your location. You have either blocked the request or your browser is blocking it for you.");
};


fetchWeather = function(lat, lon) {
    var lat = lat;
    var lon = lon;
    
    request_time = new Date();
    formatTime(request_time);
    
    $.ajax({
       url: "http://api.openweathermap.org/data/2.5/find?lat=" + lat + "&lon=" + lon + "&units=metric" + "&APPID=b582c1ea9dc1beab9b8742b7382f1ca7",
       type: 'GET',
       dataType: 'json',
       async: 'false',
       contentType: 'application/json; charset=utf-8',
       success: function(data) {
        var weatherJSON = JSON.parse(data);
           
        $('#celsius').css('color', 'rgb(179, 107, 0)');
        // populate weather details
        $('#time').html(formatTime(request_time));
        $('#city').html(getCity(weatherJSON));
        $('#temperature').html(getTemperature(weatherJSON));
        $('#scale').html("&degC");
        $('#conditions').html(getConditions(weatherJSON));
        $('#conditions-icon').html("<img class='weather-dets' src='http://openweathermap.org/img/w/"+getConditionsIcon(weatherJSON)+".png' alt='weather-icon'></img>");
        $('#wind-speed').html(getWindSpeed(weatherJSON));
        $('#wind-direction').html(getWindDirection(weatherJSON));
        $('#humidity-value').html(getHumidity(weatherJSON));
        $('#pressure-value').html(getPressure(weatherJSON));
       }
        
    });
    
    /*
    
    var weatherRequest = new XMLHttpRequest();
    var request = "http://api.openweathermap.org/data/2.5/find?lat=" + lat + "&lon=" + lon + "&units=metric" + "&APPID=b582c1ea9dc1beab9b8742b7382f1ca7";
    weatherRequest.open("GET", request, false);
    weatherRequest.send();
    console.log(weatherRequest.status);
    console.log(weatherRequest.statusText);
      
    var weatherJSON = JSON.parse(weatherRequest.response);
    
    $('#celsius').css('color', 'rgb(179, 107, 0)');
    // populate weather details
    $('#time').html(formatTime(request_time));
    $('#city').html(getCity(weatherJSON));
    $('#temperature').html(getTemperature(weatherJSON));
    $('#scale').html("&degC");
    $('#conditions').html(getConditions(weatherJSON));
    $('#conditions-icon').html("<img class='weather-dets' src='http://openweathermap.org/img/w/"+getConditionsIcon(weatherJSON)+".png' alt='weather-icon'></img>");
    $('#wind-speed').html(getWindSpeed(weatherJSON));
    $('#wind-direction').html(getWindDirection(weatherJSON));
    $('#humidity-value').html(getHumidity(weatherJSON));
    $('#pressure-value').html(getPressure(weatherJSON));
    
    */
};


$(document).ready(function () {
    //'use strict';
    
    var metric = true;

    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            fetchWeather(position.coords.latitude, position.coords.longitude);
        }, geolocationFailure);
    }
    
    
    $('#measure-toggle').on('click', function () {
        // Condition to prevent issues if user clicks toggle before data has been fetched
        if ($('#temperature').html() !== "N/A") {
            var temperature = $('#temperature').html();
            var wind = $('#wind-speed').html();
            
            if (metric) {
                fahrenheitTemp = Math.round(temperature * 9/5 + 32);
                $('#temperature').html(fahrenheitTemp);
                $('#scale').html("&degF");
                var imperialWind = Number(wind * 0.621371).toFixed(1);
                $('#wind-speed').html(imperialWind);
                $('#wind-speed-unit').html("mi/h");
                $('#pressure-unit').html("mbar");
                $('#fahrenheit').css('color', 'rgb(179, 107, 0)');
                $('#celsius').css('color', 'rgb(51, 31, 0)');
                metric = false;
            } else {
                celsiusTemp = Math.round((temperature-32) * 5/9);
                $('#temperature').html(celsiusTemp);
                $('#scale').html("&degC");
                var metricWind = Number(wind / 0.621371).toFixed(1);
                $('#wind-speed').html(metricWind);
                $("#wind-speed-unit").html("km/h");
                $('#pressure-unit').html("hPa");
                $('#celsius').css('color', 'rgb(179, 107, 0)');
                $('#fahrenheit').css('color', 'rgb(51, 31, 0)');
                metric = true;
            }
       
        }
           
    });

});
