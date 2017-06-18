function formatTime(time) {
  var year = time.getFullYear();
  var month = ("0" + (time.getMonth() + 1)).slice(-2);
  var date = ("0" + time.getDate()).slice(-2);
  var hours = ("0" + time.getHours()).slice(-2);
  var minutes = ("0" + time.getMinutes()).slice(-2);

  return year + "/" + month + "/" + date + " @ " + hours + ":" + minutes;
};

function getCity(data) {
  return data.name;
};

function getTemperature(data) {
  var temperature = data.main.temp;
  return Math.round(temperature);
};

function getHumidity(data) {
  return data.main.humidity;
};

function getPressure(data) {
  var pressure = data.main.pressure;
  return Number(pressure).toFixed(1);
};

function getConditions(data) {
  var conditions = data.weather[0].main;
  var condDetails = data.weather[0].description;

  console.log(conditions);
  var weatherImage = '';

  switch(conditions) {
    case 'Clear':
      weatherImage = 'url("images/sunny.jpg")';
      break;
    case 'Clouds':
      if (condDetails === 'broken clouds') {
        weatherImage = 'url("images/partly-cloudy.jpg")';
      } else {
        weatherImage = 'url("images/cloudy.jpg")';
      }
      break;
    case 'Rain':
      weatherImage = 'url("images/rain.jpg")';
      break;
    case 'Thunderstorm':
      weatherImage = 'url("images/thunderstorm.jpg")';
      break;
    case 'Extreme':
      weatherImage = 'url("images/extreme.jpg")';
      break;
    case 'Drizzle':
      weatherImage = 'url("images/drizzle.jpg")';
      break;
    case 'Atmosphere':
      weatherImage = 'url("images/fog.jpg")';
      break;
    case 'Snow':
      weatherImage = 'url("images/snow.jpg")';
      break;
    }

    $('#weather-background').css({
      'background': weatherImage,
      'background-size': 'cover',
      'background-repeat': 'no-repeat'
    });

  return conditions;
};

function getWindSpeed(data) {
  var speed = data.wind.speed;
  return Number(speed * 3.6).toFixed(1);
};

function getWindDirection(data) {

  var degrees = data.wind.deg;

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

function geolocationFailure() {
  removeSpinners();
  setNAVals();
  alert("Local Weather App failed to retrieve your location. You have either blocked the request or your browser is blocking it for you.");
  clearInterval(fetchTimer);
};


function addSpinners() {
  // add spinners to all the relevent id elements. These will be removed in the actual functions called inside the success function callback.
  var spinner = '<i class="fa fa-spin fa-circle-o-notch"></i>';

  $('#time').html(spinner);
  $('#city').html(spinner);
  $('#temperature').html(spinner);
  $('#conditions').html(spinner);
  $('#wind-speed').html(spinner);
  $('#wind-direction').html(spinner);
  $('#humidity-value').html(spinner);
  $('#pressure-value').html(spinner);
}

function removeSpinners() {
  var $spinners = $('.fa-circle-o-notch');
  $spinners.remove();
}

function setNAVals() {
  $('#city').html('N/A');
  $('#wind-label').html('Wind: ');
  $('#wind-speed').html('N/A');
  $('#wind-speed-unit').html('km/h');
  $('#wind-direction').html('???');
  $('#humidity-label').html('Humidity: ');
  $('#humidity-value').html('N/A');
  $('#humidity-unit').html('%');
  $('#pressure-label').html('Pressure: ');
  $('#pressure-value').html('N/A');
  $('#pressure-unit').html('hPa');
  $('#conditions').html('N/A');
  $('#temperature').html('N/A');
  $('#scale').html('&deg;');
}

function fetchWeather(lat, lon) {
  var lat = lat;
  var lon = lon;

  request_time = new Date();
  formatTime(request_time);

  var requestUrl = "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/find?lat=" + lat + "&lon=" + lon + "&units=metric" + "&APPID=b582c1ea9dc1beab9b8742b7382f1ca7";
  $.ajax({
    type: 'GET',
    url: requestUrl,
    dataType: 'json',
    beforeSend: function() {
      removeSpinners();
      addSpinners();
    },
    complete: function() {
      removeSpinners();
    },
    success: function(response) {
      var weatherData = response.list[0];
      // populate weather details
      $('#time').html(formatTime(request_time));
      $('#city').html(getCity(weatherData));
      $('#temperature').html(getTemperature(weatherData));
      $('#scale').html("&degC");
      $('#conditions').html(getConditions(weatherData));
      $('#wind-label').html('Wind: ');
      $('#wind-speed').html(getWindSpeed(weatherData));
      $('#wind-speed-unit').html('km/h');
      $('#humidity-label').html('Humidity: ');
      $('#wind-direction').html(getWindDirection(weatherData));
      $('#humidity-value').html(getHumidity(weatherData));
      $('#pressure-label').html('Pressure: ');
      $('#pressure-value').html(getPressure(weatherData));
      $('#pressure-unit').html('hPa');
      $('.celsius-units').addClass('unit-selected');
    },
    error: function(error) {
      console.log('Openweathermap data request failed with error ' + error);
      removeSpinners();
      setNAVals();
    }
  });

};


/* MAIN */

var metric = true;

addSpinners();

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        fetchWeather(position.coords.latitude, position.coords.longitude);
    }, geolocationFailure);
}

var fetchTimer = window.setInterval(function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      }, geolocationFailure);
    }
  }, 900000);


$('.switch-container').on('click', function() {

  if ($('#temperature').text() !== '') {
    var temperature = $('#temperature').html();
    var wind = $('#wind-speed').html();

    $('.switch-btn').toggleClass('switch-right');
    $('.switch-btn').toggleClass('switch-imperial');
    $('.celsius-units').toggleClass('unit-selected');
    $('.fahrenheit-units').toggleClass('unit-selected');

    if (metric) {
      fahrenheitTemp = Math.round(temperature * 9/5 + 32);
      $('#temperature').html(fahrenheitTemp);
      $('#scale').html("&degF");
      var imperialWind = Number(wind * 0.621371).toFixed(1);
      $('#wind-speed').html(imperialWind);
      $('#wind-speed-unit').html("mi/h");
      $('#pressure-unit').html("mbar");
      metric = false;
    } else {
      celsiusTemp = Math.round((temperature-32) * 5/9);
      $('#temperature').html(celsiusTemp);
      $('#scale').html("&degC");
      var metricWind = Number(wind / 0.621371).toFixed(1);
      $('#wind-speed').html(metricWind);
      $("#wind-speed-unit").html("km/h");
      $('#pressure-unit').html("hPa");
      metric = true;
    }
  }
});
