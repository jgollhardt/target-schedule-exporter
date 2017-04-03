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