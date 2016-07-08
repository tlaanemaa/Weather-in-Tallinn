// This file holds the functions for each different weather API

var endPoints = [
  function(callback) { // Function to get data
      'use strict';
      h.getJSONP('http://ilm.ee/sisu/2015/json_reaal_linn.php3?linn=L*tallinn*0', function(err, data) {
        var out;
        if(!err && data !== null) {
          // Return data in standard format if there is no error
          out = {
            name: 'Ilm.ee',
            temp: data.ilm.temp,
            rain: data.ilm.vihm,
            wind: data.ilm.tuul,
            rohk: data.ilm.rohk
          };
          callback(out);
        }
        return;
      }, true);
    },

  function(callback) { // Function to get data
      'use strict';
      h.getJSONP('http://www.ilmateenistus.ee/wp-content/themes/emhi2013/meteogram.php?locationId=784&lang=et', function(err, data) {
        var dte, dataLen, i, out;
        if(!err && data !== null) {
          // Find current time
          dte = new Date();
          dte.setMinutes(-dte.getTimezoneOffset());
          dte.setSeconds(0);
          dte.setMilliseconds(0);
          dte = dte.toISOString().slice(0, -5);
          // Find the most recent forecast
          dataLen = data.forecast.tabular.time.length;
          for(i = 0; i < dataLen; i++) {
            if(data.forecast.tabular.time[i]['@attributes'].from === dte) {
              // Return data in standard format if there is no error
              out = {
                name: 'Ilmateenistus.ee',
                temp: data.forecast.tabular.time[i].temperature['@attributes'].value + '&deg;C',
                rain: data.forecast.tabular.time[i].precipitation['@attributes'].value + ' mm/h',
                wind: data.forecast.tabular.time[i].windSpeed['@attributes'].mps + ' m/s',
                rohk: Math.round(Number(data.forecast.tabular.time[i].pressure['@attributes'].value)) + ' mmHg'
              };
              callback(out);
              break;
            }
          }
        }
        return;
      });
    },

  function(callback) { // Function to get data
      'use strict';
      h.getJSON('https://api.apixu.com/v1/current.json?key=32e14b2518374fe18c3152302160807&q=Tallinn', function(err, data) {
        var out;
        if(!err && data !== null) {
          // Return data in standard format if there is no error
          out = {
            name: 'Apixu.com',
            temp: data.current.temp_c + '&deg;C',
            rain: data.current.precip_mm + ' mm/h',
            wind: Math.round(data.current.wind_kph * 10000 / 3600) / 10 + ' m/s',
            rohk: data.current.pressure_mb + ' mmHg'
          };
          callback(out);
        }
        return;
      });
    }

];
