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
  // Get Google client id from config
  var configURL = chrome.runtime.getURL('config.json');
  fetch(configURL).then(function(response) {
    return response.json();
  }).then(function(config) {
    // Initialize the gapi client, passing along the client id
    var event = new CustomEvent("handleClientLoad", {detail: config.CLIENT_ID});
    window.dispatchEvent(event);
  });
  
  this.remove();
};
(document.head || document.documentElement).appendChild(s2);


// Grab the table containing schedule data
var table = document.getElementsByClassName("request_table_bordered")[0];
var rows = table.rows;

// array of dates, will match indices with the shift info row
var dates = [];
// Grab date information from the first row
var days = rows[0].cells;
// The row starts with an empty cell
for (var i = 1; i < days.length; i++) {
  var dateCell = days[i].innerText.trim();
  // Splits the text into ["day", "date"]
  var dateInfo = dateCell.split("\n");
  var date = dateInfo[1].trim();
  dates.push(date);
}

// Grab shift information from the third row
// If a shift exists, match it with the date collected aboves
var shiftEvents = [];
var hours = rows[2].cells;
// The row starts with an empty cell
for (var i = 1; i < hours.length; i++) {
  var shiftCell = hours[i].innerText.trim();
  // If there's a shift
  if (shiftCell != "") {
    // Splits the text into ["department", "hours", "location"]
    // location is a store identifier
    var shiftInfo = shiftCell.split("\n");
    var dept = shiftInfo[0].trim();
    var shiftHours = shiftInfo[1].trim();
    var store = shiftInfo[2].trim();
    // Split shift into begin and end time, prepend with date
    var shift = shiftHours.split(" - ");
    // For dates to parse, need to have a space between the time and 'AM' or 'PM', e.g. '03/19/17 3:24 PM'
    shift.forEach(function(time, index, array) {
      array[index] = time.slice(0, -2) + " " + time.slice(-2);
    });
    // i-1 because the dates array started at 0, while this loop started at 1
    var shiftBegin = new Date(dates[i-1] + " " + shift[0]);
    var shiftEnd = new Date(dates[i-1] + " " + shift[1]);

    var shiftEvent = {
      'summary': dept,
      'location': store,
      'start': {
        'dateTime': shiftBegin.toISOString()
      },
      'end': {
        'dateTime': shiftEnd.toISOString()
      },
      'reminders': {
        'useDefault': true
      }
    };
    shiftEvents.push(shiftEvent);
  }
}

// Button to export all calendar data
var div = document.createElement("div");
div.className = "btn-group";
var exportButton = document.createElement("button");
exportButton.className = "exportButton";
exportButton.onclick = insertShifts;
var exportText = document.createElement("p");
exportText.className = "exportText"
exportText.innerHTML = "Export to Google Calendar!!!";
exportButton.appendChild(exportText);

// Buttons to authorize with Google
var authorizeButton = document.createElement('button');
authorizeButton.id = "authorize-button";
var authorizeText = document.createTextNode("Auhorize me!");
authorizeButton.appendChild(authorizeText);

// Button to sign out of Google
var signoutButton = document.createElement('button');
signoutButton.id = "signout-button";
var signoutText = document.createTextNode("Sign out");
signoutButton.appendChild(signoutText);

var exportList = document.createElement('ul');
exportList.id = "exportList";
exportList.className = "exportList";

div.appendChild(exportButton);
div.appendChild(authorizeButton);
div.appendChild(signoutButton);
div.appendChild(exportList);
table.parentNode.insertBefore(div, table.nextSibling);


function insertShifts() {
  shiftEvents.forEach(function(entry) {
    var event = new CustomEvent("insertEvent", {detail: entry});
    window.dispatchEvent(event);
  });
}
