// The OAuth 2 parts of the gapi client don't seem to work from a Chrome extension (https://github.com/google/google-api-javascript-client/issues/64)
// To get around that, inject the gapi library onto the page (http://stackoverflow.com/a/9517879)
var s = document.createElement('script');
s.src = chrome.runtime.getURL('api.js');
s.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

// Inject gapi setup
var s2 = document.createElement('script');
s2.src = chrome.runtime.getURL('gapi_setup.js');
s2.onload = function() {
  // get Google client id from config
  var configURL = chrome.runtime.getURL('config.json');
  fetch(configURL).then(function(response) {
    return response.json();
  }).then(function(config) {
    // initialize the gapi client, passing along the client id
    var event = new CustomEvent("handleClientLoad", {detail: config.CLIENT_ID});
    window.dispatchEvent(event);
  });
  
  this.remove();
};
(document.head || document.documentElement).appendChild(s2);


// Grab the table containing schedule data
var rows = document.getElementsByClassName("request_table_bordered")[0].rows;

// First row is the date information
var days = rows[0].cells;
for (var i = 1; i < days.length; i++) {
  var dateCell = days[i].innerText.trim();
  // Splits the text into ["day", "date"]
  var dateInfo = dateCell.split("\n");
  var day = dateInfo[0].trim();
  var date = dateInfo[1].trim();
  console.log("The day is: " + day);
  console.log("The date is: " + date);
}

// Third row is the shift information
var hours = rows[2].cells;
for (var i = 1; i < hours.length; i++) {
  var shiftCell = hours[i].innerText.trim();
  // if there's nothing in the cell, ignore it
  if (shiftCell != "") {
    // Splits the text into ["department", "hours", "location"]
    // location appears to be a store identifier
    var shiftInfo = shiftCell.split("\n");
    var dept = shiftInfo[0].trim();
    var shiftHours = shiftInfo[1].trim();
    var store = shiftInfo[2].trim();
    console.log("You will be working in: " + dept + " at store #: " + store);
    console.log("Your hours are: " + shiftHours);
  }
}
