document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  // Slight delay to make sure the fade in transition triggers
  setTimeout(function(){
    getData();
    setInterval(getData, 300000); // Get new data every 5 min
  }, 100);
});

// Function to write weather data out
function writeData(data) {
  'use strict';
  var out, elem;
  out = '<a class="name" href="http://www.' + data.name + '" target="_blank">' + data.name + '</a>';
  out = out + '<div class="big">' + data.temp + '</div>';
  out = out + '<div class="small"><div class="wind"></div>' + data.wind + '</div>';
  out = out + '<div class="small"><div class="rain"></div>' + data.rain + '</div>';
  out = out + '<div class="small"><div class="rohk"></div>' + data.rohk + '</div>';
  elem = h.id(data.name);
  elem.innerHTML = out;
  h.addClass(elem, 'shown');
}

// Function to loop through endpoints and request data
function getData() {
  'use strict';
  var i, len = endPoints.length;
  for(i = 0; i < len; i++) endPoints[i](writeData);
}
