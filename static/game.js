var socket = io();

socket.emit('new player');

var localState = {};
var stateProxy = new Proxy(localState, {
  set: function (target, key, value) {
      console.log(`${key} set to ${value}`);
      target[key] = value;
      return true;
  }
});

//
// Declare and initialize DOM variables
//
// Initalize ezel en rattentellers
let aantalEzels = document.getElementById('ezelTeller').getElementsByTagName('p')[0];
let aantalRatten = document.getElementById('rattenTeller').getElementsByTagName('p')[0];

// Initialize spelmodus 
let spelModus = document.getElementById("spelModus").getElementsByTagName('p')[0];

// Log the messages from the server
socket.on('message', function (data) {
  console.log(data);
  displayMessage(data);
});

function displayMessage(message) {
  var infoBox = document.getElementById('actueleSpelInformatie');
  infoBox.innerHTML = message;
}

function dismissMessage() {
  var infoBox = document.getElementById('actueleSpelInformatie');
  infoBox.style.backgroundColor = 'transparent';
  infoBox.innerHTML = null;
}

// Update ezel teller en rattenteller
socket.on('state', function(data){
  aantalEzels.innerText = "Ezels: " + data.ezelCount;
  aantalRatten.innerText = "Ratten: " + data.ratCount;
  spelModus.innerText = data.modus;
})
