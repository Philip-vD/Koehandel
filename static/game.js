var socket = io();

var name = prompt("Please enter your name");

var localState = {};

socket.emit('new player', name);

var virtueelBedrag = {
  0: 0,
  10: 0,
  20: 0,
  50: 0,
  100: 0,
  200: 0,
  500: 0,
};
//localState.players[socket.id].isLeader

// Helper functies
function cardCount(money) {
  return Object.values(money).reduce((a, b) => a + b, 0);
}

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

// Initialize modus paneel
let modusPaneel = document.getElementById("spelModus");

// Initialize uitgedaagde Koehandel menu en knoppen
let uitgedaagdeKoehandelScherm = document.getElementById('uitgedaagdeKoehandelScherm');
let tegenBodButton = document.getElementById('tegenBodButton');
tegenBodButton.addEventListener('click', doeTegenBod, false);
let accepteerKoehandelButton = document.getElementById('accepteerKoehandel');
accepteerKoehandelButton.addEventListener('click', accepteerKoehandel, false);

// Initialize geld plus 1 min1 knoppen
let min1Knoppen = document.getElementsByClassName("min1Button");
for(var knop of min1Knoppen){
  knop.addEventListener('click', verlaagBedrag, false);
}
let plus1Knoppen = document.getElementsByClassName("plus1Button");
for(var knop of plus1Knoppen){
  knop.addEventListener('click', verhoogBedrag, false);
}

// Handle alle koehandel knoppen
function accepteerKoehandel(){
  uitgedaagdeKoehandelScherm.style.display = "none";
}
function doeTegenBod(){
  uitgedaagdeKoehandelScherm.style.display = "none";
}

// Verhoog of verlaag de bedragen in een betaling of handel
function verlaagBedrag(e){
  let bedragString = e.target.parentNode.previousSibling.previousSibling;
  let child = e.target.parentNode;
  var i = 0;
  while( (child = child.previousSibling) != null ) {
    i++;
  }
  switch(i){
    case 1:
      console.log("Verlaag 0");
      break;
    case 7:
      console.log("Verlaag 10");
      break;
    case 13:
      console.log("Verlaag 20");
      break;
    case 19:
      console.log("Verlaag 50");
      break;
    case 25:
      console.log("Verlaag 100");
      break;
    case 31:
      console.log("Verlaag 200");
      break;
    case 37:
      console.log("Verlaag 500");
      break;
  }
}

function verhoogBedrag(e){
  let bedragString = e.target.parentNode.previousSibling.previousSibling;

  // Enable the min 1 knop voor het juiste bedrag
  let min1Knop = e.target.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.children[0];
  min1Knop.disabled = false;


  let child = e.target.parentNode;
  var i = 0;
  while( (child = child.previousSibling) != null ) {
    i++;
  }
  switch(i){
    case 5:
      console.log("Verhoog 0");
      break;
    case 11:
      console.log("Verhoog 10");
      break;
    case 17:
      console.log("Verhoog 20");
      break;
    case 23:
      console.log("Verhoog 50");
      break;
    case 29:
      console.log("Verhoog 100");
      break;
    case 35:
      console.log("Verhoog 200");
      break;
    case 41:
      console.log("Verhoog 500");
      break;
  }
}

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
      innerHTML += generateOpponentHTML(value.name, cardCount(value.money));
    }
  }
  console.log(innerHTML);
  opponentContainer.innerHTML = innerHTML;
}

// Update ezel teller en rattenteller
socket.on('updateEzelCount', function(state){
  localState.ezelCount = state.ezelCount;
  aantalEzels.innerText = "Ezels: " + localState.ezelCount;
});
socket.on('updateRatCount', function(state){
  localState.ratCount = state.ratCount;
  aantalRatten.innerText = "Ratten: " + localState.ezelCount;
});

// Update modus 
socket.on('updateModus', function(state){
  localState.modus = state.modus;
  if(localState.modus === 'geen'){
    modusPaneel.style.display = "none";
  } else{
    modusPaneel.style.display = "block";
    spelModus.innerText = localState.modus;
  }
});

socket.on('updatePlayers', function(state) {
  localState.players = state.players;
  mijnNaam.innerHTML = localState.players[socket.id].name;
  renderOpponents(localState.players);
})