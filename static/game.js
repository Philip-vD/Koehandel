var socket = io();

var name = prompt("Please enter your name");

var localState = {};

socket.emit('new player', name);

let virtueelBedrag = {};
let virtueelBod = {
  0: 0,
  10: 0,
  20: 0,
  50: 0,
  100: 0,
  200: 0,
  500: 0,
};
//localState.players[socket.id].isLeader

//
// Declare and initialize DOM variables
//
// Declare actieknoppen
let actieKnoppen2 = {}
let knoppenActie = document.getElementsByClassName("actieKnop");


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

// Initialize Koehandel menu en knoppen
let uitgedaagdeKoehandelScherm = document.getElementById('uitgedaagdeKoehandelScherm');
let tegenBodButton = document.getElementById('tegenBodButton');
tegenBodButton.addEventListener('click', doeTegenBod, false);
let accepteerKoehandelButton = document.getElementById('accepteerKoehandel');
accepteerKoehandelButton.addEventListener('click', accepteerKoehandel, false);
actieKnoppen2.Koehandel = knoppenActie[0];
actieKnoppen2.Koehandel.addEventListener('click', updateGeldKnoppen, false);

// Initialize geld plus 1 min1 knoppen
let min1Knoppen = document.getElementsByClassName("min1Button");
for(var knop of min1Knoppen){
  knop.addEventListener('click', verlaagBedrag, false);
}
let plus1Knoppen = document.getElementsByClassName("plus1Button");
for(var knop of plus1Knoppen){
  knop.addEventListener('click', verhoogBedrag, false);
}

// Initialize betaalmenu
actieKnoppen2.Betaling = knoppenActie[3];
actieKnoppen2.Betaling.addEventListener('click', updateGeldKnoppen, false);

// Handle alle koehandel knoppen
function accepteerKoehandel(){
  uitgedaagdeKoehandelScherm.style.display = "none";
}
function doeTegenBod(){
  uitgedaagdeKoehandelScherm.style.display = "none";
}

// Bereken totaal geld hulpfunctie
function calculateTotal(money) {
  var res = 0;
  for (const [amount, times] of Object.entries(money)) {
    res += times * amount;
  }
  return res;
}

// Disable alle geldknoppen
function updateGeldKnoppen(){
  for(let i = 0; i < plus1Knoppen.length; i++)
  {
    switch(i%7){
      case 0:
        if(virtueelBedrag["0"] === 0)
          plus1Knoppen[i].disabled = true;
        break;
        case 1:
        if(virtueelBedrag["10"] === 0)
          plus1Knoppen[i].disabled = true;
        break;
        case 2:
        if(virtueelBedrag["20"] === 0)
          plus1Knoppen[i].disabled = true;
        break;
        case 3:
        if(virtueelBedrag["50"] === 0)
          plus1Knoppen[i].disabled = true;
        break;
        case 4:
        if(virtueelBedrag["100"] === 0)
          plus1Knoppen[i].disabled = true;
        break;
        case 5:
        if(virtueelBedrag["200"] === 0)
          plus1Knoppen[i].disabled = true;
        break;
        case 6:
        if(virtueelBedrag["500"] === 0)
          plus1Knoppen[i].disabled = true;
        break;
    }
  }
}

// Verhoog of verlaag de bedragen in een betaling of handel
function verlaagBedrag(e){
  let bedragString = e.target.parentNode.nextSibling.nextSibling;
  let child = e.target.parentNode;
  let plus1Knop = e.target.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.children[0];
  var i = 0;
  while( (child = child.previousSibling) != null ) {
    i++;
  }
  switch(i){
    case 1:
      virtueelBod["0"]--;
      virtueelBedrag["0"]++;
      if(virtueelBod["0"] === 0)
      {
        e.target.disabled = true;
      }
      if(virtueelBedrag["0"] !== 0 && plus1Knop.disabled === true){
        plus1Knop.disabled = false;
      }
      bedragString.innerText = virtueelBod["0"];
      break;
    case 7:
      virtueelBod["10"]--;
      virtueelBedrag["10"]++;
      if(virtueelBod["10"] === 0)
      {
        e.target.disabled = true;
      }
      if(virtueelBedrag["10"] != 0){
        plus1Knop.disabled = false;
      }
      bedragString.innerText = virtueelBod["10"];
      break;
    case 13:
      virtueelBod["20"]--;
      virtueelBedrag["20"]++;
      if(virtueelBod["20"] === 0)
      {
        e.target.disabled = true;
      }
      if(virtueelBedrag["20"] != 0){
        plus1Knop.disabled = false;
      }
      bedragString.innerText = virtueelBod["20"];
      break;
    case 19:
      virtueelBod["50"]--;
      virtueelBedrag["50"]++;
      if(virtueelBod["50"] === 0)
      {
        e.target.disabled = true;
      }
      if(virtueelBedrag["50"] != 0){
        plus1Knop.disabled = false;
      }
      bedragString.innerText = virtueelBod["50"];
      break;
    case 25:
      virtueelBod["100"]--;
      virtueelBedrag["100"]++;
      if(virtueelBod["100"] === 0)
      {
        e.target.disabled = true;
      }
      if(virtueelBedrag["100"] != 0){
        plus1Knop.disabled = false;
      }
      bedragString.innerText = virtueelBod["100"];
      break;
    case 31:
      virtueelBod["200"]--;
      virtueelBedrag["200"]++;
      if(virtueelBod["200"] === 0)
      {
        e.target.disabled = true;
      }
      if(virtueelBedrag["200"] != 0){
        plus1Knop.disabled = false;
      }
      bedragString.innerText = virtueelBod["200"];
      break;
    case 37:
      virtueelBod["500"]--;
      virtueelBedrag["500"]++;
      if(virtueelBod["500"] === 0)
      {
        e.target.disabled = true;
      }
      if(virtueelBedrag["500"] != 0){
        plus1Knop.disabled = false;
      }
      bedragString.innerText = virtueelBod["500"];
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
      virtueelBod["0"]++;
      virtueelBedrag["0"]--;
      if(virtueelBedrag["0"] === 0){
        e.target.disabled = true;
      }
      bedragString.innerText = virtueelBod["0"];
      break;
    case 11:
      virtueelBod["10"]++;
      virtueelBedrag["10"]--;
      if(virtueelBedrag["10"] === 0){
        e.target.disabled = true;
      }
      bedragString.innerText = virtueelBod["10"];
      break;
    case 17:
      virtueelBod["20"]++;
      virtueelBedrag["20"]--;
      if(virtueelBedrag["20"] === 0){
        e.target.disabled = true;
      }
      bedragString.innerText = virtueelBod["20"];
      break;
    case 23:
      virtueelBod["50"]++;
      virtueelBedrag["50"]--;
      if(virtueelBedrag["50"] === 0){
        e.target.disabled = true;
      }
      bedragString.innerText = virtueelBod["50"];
      break;
    case 29:
      virtueelBod["100"]++;
      virtueelBedrag["100"]--;
      if(virtueelBedrag["100"] === 0){
        e.target.disabled = true;
      }
      bedragString.innerText = virtueelBod["100"];
      break;
    case 35:
      virtueelBod["200"]++;
      virtueelBedrag["200"]--;
      if(virtueelBedrag["200"] === 0){
        e.target.disabled = true;
      }
      bedragString.innerText = virtueelBod["200"];
      break;
    case 41:
      virtueelBod["500"]++;
      virtueelBedrag["500"]--;
      if(virtueelBedrag["500"] === 0){
        e.target.disabled = true;
      }
      bedragString.innerText = virtueelBod["500"];
      break;
  }
  console.log(calculateTotal(virtueelBod));
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
      innerHTML += generateOpponentHTML(value.name, 12);
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