var socket = io();

var name = prompt("Please enter your name");

var localState = {};

socket.emit('new player', name);

//localState.players[socket.id].isLeader

//
// Declare and initialize DOM variables
//
// Initalize ezel en rattentellers
let aantalEzels = document.getElementById('ezelTeller').getElementsByTagName('p')[0];
let aantalRatten = document.getElementById('rattenTeller').getElementsByTagName('p')[0];
let mijnNaam = document.getElementById('myName');
let opponentContainer = document.getElementById('opponentContainer');

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

function generateOpponentHTML(name, count) {
  return '<div class=\"opponentObject\"><p>' + name + '<br>' + count + ' krtn</p></div>';
}

function renderOpponents(players) {
  var innerHTML = '';
  for (let [key, value] of Object.entries(players)) {
    if (!(key === socket.id)) {
      innerHTML += generateOpponentHTML(value.name, 12);
    }
  }
  console.log(innerHTML);
  opponentContainer.innerHTML = innerHTML;
}

// Update ezel teller en rattenteller
socket.on('updateEzelCount', function(state){
  localState = state;
  aantalEzels.innerText = "Ezels: " + localState.ezelCount;
});
socket.on('updateRatCount', function(state){
  localState = state;
  aantalRatten.innerText = "Ratten: " + localState.ezelCount;
});
socket.on('updateModus', function(state) {
  localState = state;
  spelModus.innerText = localState.ratCount;
});

socket.on('updatePlayers', function(state) {
  localState.players = state.players;
  mijnNaam.innerHTML = localState.players[socket.id].name;
  renderOpponents(localState.players);
})