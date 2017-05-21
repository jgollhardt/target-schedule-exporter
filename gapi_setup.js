var authorizeButton = document.createElement('button');
authorizeButton.id = "authorize-button";
authorizeButton.onclick = handleAuthClick;
var authorizeText = document.createTextNode("Auhorize me!");
authorizeButton.appendChild(authorizeText);

var signoutButton = document.createElement('button');
signoutButton.id = "signout-button";
signoutButton.onclick = handleSignoutClick;
var signoutText = document.createTextNode("Sign out");
signoutButton.appendChild(signoutText);


var tmp = document.createElement('pre');
tmp.id = 'content';

var body = document.getElementsByTagName("body")[0];
body.appendChild(authorizeButton);
body.appendChild(signoutButton);
body.appendChild(tmp);

// Array of API discovery doc URLs for APIs used
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message, link) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode('\n' + message);
  var htmlContent = document.createElement('a');
  htmlContent.href = link;
  htmlContent.innerHTML = link;
  htmlContent.target = "_blank";

  pre.appendChild(textContent);
  pre.appendChild(htmlContent);
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad(evt) {
  this.CLIENT_ID = evt.detail;
  gapi.load('client:auth2', initClient);
}

/**
 * Insert an event into Google Calendar
 */
function insertEvent(evt) {
  var event = evt.detail;

  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function(event) {
    appendPre('Event created: ', event.htmlLink);
  });
}

window.addEventListener("handleClientLoad", handleClientLoad, false);
window.addEventListener("insertEvent", insertEvent, false);
