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

function resetVirtueelBod() {
  virtueelBod = {
    0: 0,
    10: 0,
    20: 0,
    50: 0,
    100: 0,
    200: 0,
    500: 0,
  };
}

function jsonCopy(src){
  return JSON.parse(JSON.stringify(src));
}

function resetVirtueelBedrag(){
  virtueelBedrag = jsonCopy(localState.players[socket.id].money);
}

// Helper functies
// Bereken aantal kaarten
function cardCount(money) {
  return Object.values(money).reduce((a, b) => a + b, 0);
}

// Bereken totaal geld hulpfunctie
function calculateTotal(money) {
  var res = 0;
  for (const [amount, times] of Object.entries(money)) {
    res += times * amount;
  }
  return res;
}

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
let betaaldeSelect = document.getElementById('betaalde');
let uitgedaagdeSelect = document.getElementById('uitgedaagde');
betaaldeSelect.addEventListener('change', updateBetaalTekst, false);
uitgedaagdeSelect.addEventListener('change', updateKoehandelTekst, false);

// Initialize spelmodus 
let spelMode = document.getElementById("spelModus").getElementsByTagName('p')[0];

// Initalize naam submit and add eventlistener
let naamSubmit = document.getElementById('naamSubmit');
naamSubmit.addEventListener('click', veranderNaam, false);
let naamInput = naamSubmit.previousSibling.previousSibling;
let totaalGeld = document.getElementById("totaalGeld");

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

// Initialize rathandel 
let rathandelScherm = document.getElementById('rathandelScherm');
actieKnoppen2.Rathandel = knoppenActie[2];
actieKnoppen2.Rathandel.addEventListener('click', startRathandel, false);

// Initialize stamboekhandel
let stamboekHandelScherm = document.getElementById('stamboekHandelScherm');
actieKnoppen2.Stamboek = knoppenActie[1];
actieKnoppen2.Stamboek.addEventListener('click', startStamboekHandel, false);

// Initialize betaalmenu
let betaalMenu = document.getElementById("betaalScherm");
actieKnoppen2.Betaling = knoppenActie[3];
actieKnoppen2.Betaling.addEventListener('click', updateGeldKnoppen, false);
actieKnoppen2.Betaling.addEventListener('click', updateBetaalTekst, false);
let betaalSchermTekst = document.getElementById("betaalInfo");

// Initialize alle knoppen die disabled worden tijdens handel
let disableKnoppen = document.getElementsByClassName('disableKnoppen');

// Initialize de telknoppen voor ratten en ezels
let ratPlus = document.getElementById("ratPlus1");
let ezelPlus = document.getElementById('ezelPlus1');
ratPlus.addEventListener('click', addRat, false);
ezelPlus.addEventListener('click', addEzel, false);

// Initialize start koehandel scherm
var startKoehandelScherm = document.getElementById("startKoehandelScherm");
var startKoehandelTekst = document.getElementById('koeHandelInzet');


// Open koehandel scherm
function openKoehandelScherm(){
  startKoehandelScherm.style.display = "block";
  updateKoehandelTekst();
}

function updateKoehandelTekst(){
  startKoehandelTekst.innerText = "Je gaat " + calculateTotal(virtueelBod) + " inleggen en daagt uit: " + uitgedaagde.options[uitgedaagdeSelect.selectedIndex].innerText;
}


// Update de betaaltekst
function updateBetaalTekst(){
  betaalSchermTekst.innerText = "Je gaat " + calculateTotal(virtueelBod) + " betalen aan " + betaaldeSelect.options[betaaldeSelect.selectedIndex].innerText;
}

// Remove counter knoppen 
function removeCounters(isLeader){
  if(!isLeader){
    ratPlus.style.display = "none";
    ezelPlus.style.display = "none";
  }
}

// Voeg ezel of rat toe
function addRat(){
  socket.emit('rat');
}
function addEzel(){
  socket.emit('ezel');
}

// Disable alle knoppen tijdens handel
function disableButtons(){
  for(var knop of disableKnoppen){
    knop.disabled = true;
  }
}

function enableButtons(){
  for(var knop of disableKnoppen){
    knop.disabled = false;
  }
}

// Start de rathandel
function startRathandel(){
  socket.emit('startRatHandel');
}

// Start de stamboekhandel
function startStamboekHandel(){
  socket.emit('startStamboekHandel');
}

// Handle alle koehandel knoppen
function accepteerKoehandel(){
  uitgedaagdeKoehandelScherm.style.display = "none";
}
function doeTegenBod(){
  uitgedaagdeKoehandelScherm.style.display = "none";
}


function handleStartKoehandel() {
  var challengedId = uitgedaagdeSelect.value;
  socket.emit('startKoehandel', { challengedId, offer: virtueelBod });
  resetVirtueelBod();
  resetVirtueelBedrag();
  startKoehandelScherm.style.display = "none";
}

function handleSubmitRatHandel() {
  socket.emit('submitRatHandel', virtueelBod);
  resetVirtueelBod();
  resetVirtueelBedrag();
  disableMin1Knoppen();
  resetGeldBedragen();
  updateGeldKnoppen();
}

function handleAcceptRatHandel() {
  socket.emit('acceptRatHandel');
  resetVirtueelBod();
  resetVirtueelBedrag();
}

function handleCounterKoehandel() {
  socket.emit('counterKoehandel', virtueelBod);
  resetVirtueelBod();
  resetVirtueelBedrag();
}

function handleAcceptKoehandel() {
  socket.emit('acceptKoehandel');
  resetVirtueelBod();
  resetVirtueelBedrag();
}

function sluitBetaal(){
  resetVirtueelBod();
  resetVirtueelBedrag();
  betaalMenu.style.display = "none";
  resetGeldBedragen();
  disableMin1Knoppen();
  updateGeldKnoppen();
}

function handleBetaal(){
  var recipient = betaaldeSelect.value;
  socket.emit('giveMoney', {money: virtueelBod, recipient })
  resetVirtueelBod();
  resetVirtueelBedrag();
  betaalMenu.style.display = "none";
}

function sluitStartKoehandelScherm(){
  startKoehandel.scherm.style.display = "none";
  resetVirtueelBod();
  resetVirtueelBedrag();
  resetGeldBedragen();
  disableMin1Knoppen();
}

// Disable alle min1 knoppen 
function disableMin1Knoppen(){
  for(var knop of min1Knoppen){
    if(!knop.disabled){
      knop.disabled = true;
    }
  }
}

// Reset de geldbedragen
function resetGeldBedragen(){
  let geldTabellen = document.getElementsByClassName("geldTabel");
  for(var tabel of geldTabellen){
    for(let i = 0; i<tabel.children.length; i++)
    {
      if((i%3) === 1){
        tabel.children[i].innerText = "0";
      }
    }
  }
}

// Disable alle geldknoppen
function updateGeldKnoppen(){
  for(let i = 0; i < plus1Knoppen.length; i++)
  {
    switch(i%7){
      case 0:
        if(virtueelBedrag["0"] === 0)
          plus1Knoppen[i].disabled = true;
        else{
          plus1Knoppen[i].disabled = false;
        }
        break;
        case 1:
        if(virtueelBedrag["10"] === 0)
          plus1Knoppen[i].disabled = true;
        else
          plus1Knoppen[i].disabled = false;
        break;
        case 2:
        if(virtueelBedrag["20"] === 0)
          plus1Knoppen[i].disabled = true;
        else
          plus1Knoppen[i].disabled = false;
        break;
        case 3:
        if(virtueelBedrag["50"] === 0)
          plus1Knoppen[i].disabled = true;
        else
          plus1Knoppen[i].disabled = false;
        break;
        case 4:
        if(virtueelBedrag["100"] === 0)
          plus1Knoppen[i].disabled = true;
        else
          plus1Knoppen[i].disabled = false;
        break;
        case 5:
        if(virtueelBedrag["200"] === 0)
          plus1Knoppen[i].disabled = true;
        else
          plus1Knoppen[i].disabled = false;
        break;
        case 6:
        if(virtueelBedrag["500"] === 0)
          plus1Knoppen[i].disabled = true;
        else
          plus1Knoppen[i].disabled = false;
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
  updateBetaalTekst();
  updateKoehandelTekst();
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
  updateBetaalTekst();
  updateKoehandelTekst();
}

// Log the messages from the server
socket.on('message', function (data) {
  console.log(data);
  displayMessage(data);
});

function displayMessage(message) {
  var infoBox = document.getElementById('actueleSpelInformatie');
  var infoBoxP = document.getElementById('actueleSpelInformatie').getElementsByTagName('p')[0];
  infoBoxP.innerText = message;
  infoBox.style.display = "block";
}

function dismissMessage() {
  var infoBox = document.getElementById('actueleSpelInformatie');
  infoBox.style.display = "none";
}

function claimStamboekDier() {
  socket.emit('acceptStamboekHandel');
}

// Verander naam 
function veranderNaam(e){
  e.preventDefault();
  socket.emit('nameChange', naamInput.value);
}

function generateOpponentHTML(name, count) {
  return '<div class=\"opponentObject\"><p>' + name + '<br>' + count + ' krtn</p></div>';
}

function generateRecipientHTML(name, id) {
  return '<option value=\"' + id + '\">' + name + '</option>';
}

function setSelectOptions(players) {
  var innerHTML = '';
  for (let [key, value] of Object.entries(players)) {
    if (!(key === socket.id)) {
      innerHTML += generateRecipientHTML(value.name, key);
    }
  }
  betaaldeSelect.innerHTML = innerHTML;
  uitgedaagdeSelect.innerHTML = innerHTML;
}

function renderOpponents(players) {
  var innerHTML = '';
  for (let [key, value] of Object.entries(players)) {
    if (!(key === socket.id)) {
      innerHTML += generateOpponentHTML(value.name, cardCount(value.money));
    }
  }
  opponentContainer.innerHTML = innerHTML;
}

function renderOwnMoney(money) {
  for (let [key, value] of Object.entries(money)) {
    document.getElementById('cardCount' + key).innerHTML = value;
  }
  totaalGeld.innerText = "Totaal: " + calculateTotal(money);
  virtueelBedrag = jsonCopy(money);
}

// Update ezel teller en rattenteller
socket.on('updateEzelCount', function(state){
  localState.ezelCount = state.ezelCount;
  aantalEzels.innerText = "Ezels: " + localState.ezelCount;
});
socket.on('updateRatCount', function(state){
  localState.ratCount = state.ratCount;
  aantalRatten.innerText = "Ratten: " + localState.ratCount;
});

// Update modus 
socket.on('updateMode', function(state){
  let mode = state.mode;
  localState.mode = mode;
  if(localState.mode === 'geen'){
    modusPaneel.style.display = "none";
    stamboekHandelScherm.style.display = "none";
    rathandelScherm.style.display = "none";
    uitgedaagdeKoehandelScherm.style.display = "none";
    enableButtons();
  } else{
    modusPaneel.style.display = "block";
    switch (mode){
      case 'koehandel':
        spelModus.getElementsByTagName('p')[0].innerText = "Koehandel";
        disableButtons();
        break;
      case 'stamboekhandel':
        spelModus.getElementsByTagName('p')[0].innerText = "Stamboekhandel";
        stamboekHandelScherm.style.display = "block";
        disableButtons();
        break;
      case 'rathandel':
        updateGeldKnoppen();
        spelModus.getElementsByTagName('p')[0].innerText = "Rathandel";
        rathandelScherm.style.display = "block";
        disableButtons();
        break;
    }
  }
});

socket.on('challenged', function() {
  uitgedaagdeKoehandelScherm.style.display = "block";
});

socket.on('updatePlayers', function(state) {
  localState.players = state.players;
  mijnNaam.innerHTML = localState.players[socket.id].name;
  renderOpponents(localState.players);
  renderOwnMoney(localState.players[socket.id].money);
  setSelectOptions(localState.players);
  removeCounters(localState.players[socket.id].isLeader);
});