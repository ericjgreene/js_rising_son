window.onload = function() {
  var sunrise, sunset, currentTime;

  makeAjaxRequest();

  function makeAjaxRequest() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        parseResponse(httpRequest.responseText);
      }
    }
    httpRequest.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=miami,us&APPID=c126e38e46ea8f2eb81fd28f3703b034', true);
    httpRequest.send(null);
  }

  function parseResponse(response) {
    var jsonResponse = JSON.parse(response);
    sunrise = jsonResponse.sys.sunrise;
    sunset = jsonResponse.sys.sunset;
    currentTime = new Date().getTime() / 1000; // time since epoch in seconds

    // testing xhrs in the past
    currentTime = currentTime - 4*60*60;

    calculatePosition(sunrise, sunset, currentTime);
  }

  function calculatePosition(sunrise, sunset, currentTime) {
    var sunriseToNow = currentTime - sunrise;
    var day = sunset - sunrise;
    var noon = sunrise + (day/2);
    var morning = noon - sunrise;
    var afternoon = sunset - noon;
    var nowToNoon = noon - currentTime;
    var noonToNow = currentTime - noon;

    var sunY;
    if (currentTime < noon) {
      console.log('morning');
      sunY =  (nowToNoon/morning) * 100;
    } else {
      console.log('afternoon');
      sunY = (noonToNow/afternoon) * 100;
    }

    var sunX = (sunriseToNow/day) * 100;

    positionSun(sunX, sunY);
  }

  function positionSun(sunX, sunY) {
    var sun = document.getElementById('sun');
    console.log({x: sunX, y: sunY});
    sun.style.left = sunX + "%";
    sun.style.top = sunY + "%";
  }

  // animate the sun
  // setInterval(function() {
  //   currentTime = currentTime - 20*60;
  //   calculatePosition(sunrise, sunset, currentTime)
  // }, 1000);
}
