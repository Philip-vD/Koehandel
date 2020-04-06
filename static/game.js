var socket = io();

var name = prompt("Please enter your name");

socket.emit('new player', name);

var localState = {};

//localState.players[socket.id].isLeader

//
// Declare and initialize DOM variables
//
// Initalize ezel en rattentellers
let aantalEzels = document.getElementById('ezelTeller').getElementsByTagName('p')[0];
let aantalRatten = document.getElementById('rattenTeller').getElementsByTagName('p')[0];

// Initialize spelmodus 
let spelModus = document.getElementById("spelModus").getElementsByTagName('p')[0];

// Initalize naam submit and add eventlistener
let naamSubmit = document.getElementById('naamSubmit');
naamSubmit.addEventListener('click', veranderNaam, false);
let naamInput = naamSubmit.previousSibling.previousSibling;


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

// Verander naam 
function veranderNaam(e){
  e.preventDefault();
  socket.emit('nameChange', naamInput.value);
}

// Update ezel teller en rattenteller
socket.on('updateEzel', function(state){
  aantalEzels.innerText = "Ezels: " + localState.ezelCount;
});
socket.on('updateRat', function(state){
  aantalRatten.innerText = "Ratten: " + localState.ezelCount;
});
socket.on('updateModus', function(state){
  spelModus.innerText = localState.ratCount;
});