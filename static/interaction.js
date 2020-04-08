// Declare variables
let actieKnoppen = {};
let betaalKnoppen = {};
let betaalScherm;
let startKoehandel = {};
let veranderNaamScherm;
let veranderNaamKnop;

// Functie om het betaalmenu te openen/sluiten
function openBetaalMenu(){
  betaalScherm.style.display = "block";
}
function sluitBetaalMenu(){
  betaalScherm.style.display = "none";
}

// Functies voor startKoehandelScherm
function openStartKoehandelScherm(){
  startKoehandel.scherm.style.display = "block";
}
function sluitStartKoehandelScherm(){
  startKoehandel.scherm.style.display = "none";
}
function veranderUitgedaagde(){
  startKoehandel.tekst.innerText = "Je gaat # inleggen en daagt " + startKoehandel.uitgedaagde.value + " uit.";
}

// Toon naam verander menu
function openNaamMenu(){
  veranderNaamScherm.style.display = "block";
}
function sluitNaamMenu(){
  veranderNaamScherm.style.display = "none";
}

// Create a function that resizes the game to the correct ratio
function resizeGame(){
  let gameArea = document.getElementById("gameArea");
  let widthToHeight = 4/3;
  let newWidth = window.innerWidth;
  let newHeight = window.innerHeight;
  let newWidthToHeight = newWidth/newHeight;
  let actieKnop = document.getElementsByClassName("actieKnop");
  for(var knop of actieKnop)
  {
    knop.style.borderRadius = "45%/15%";
  }

  if(newWidth > gameArea.offsetWidth & newHeight > gameArea.offsetHeight){
    if (newWidthToHeight > widthToHeight) {
      // window width is too wide relative to desired game width
      newWidth = newHeight * widthToHeight;
      gameArea.style.height = newHeight + 'px';
      gameArea.style.width = newWidth + 'px';
    } else { // window height is too high relative to desired game height
      newHeight = newWidth / widthToHeight;
      gameArea.style.width = newWidth + 'px';
      gameArea.style.height = newHeight + 'px';
    }
  
    // Center the canvas 
    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
  
    // Adjust fontsize
    gameArea.style.fontSize = (newWidth / 400) + 'em';
  }
}

// Initialize variables
function initializeVariables(){
  // Initialize actie knoppen
  let knoppenActie = document.getElementsByClassName("actieKnop");
  actieKnoppen.Koehandel = knoppenActie[0];
  actieKnoppen.Stamboek = knoppenActie[1];
  actieKnoppen.Rathandel = knoppenActie[2];
  actieKnoppen.Betaling = knoppenActie[3];

  // Initialize annuleer/betaal knop en betaalscherm
  betaalKnoppen.annuleer = document.getElementById('annuleerBetaling');
  betaalKnoppen.betaal = document.getElementById('betaalButton');
  betaalScherm = document.getElementById("betaalScherm");

  // Initialize naam verandering scherm
  veranderNaamScherm = document.getElementById("changeNamePanel");
  veranderNaamKnop = document.getElementById("veranderNaam");
  naamSubmit = document.getElementById('naamSubmit');

  // Initialize start koehandel scherm
  startKoehandel.annuleer = document.getElementById("annuleerKoehandel");
  startKoehandel.daagUit = document.getElementById("startKoehandelButton");
  startKoehandel.scherm = document.getElementById("startKoehandelScherm");
  startKoehandel.uitgedaagde = document.getElementById("uitgedaagde");
  startKoehandel.tekst = document.getElementById("koeHandelInzet");
}

// Add eventlisteners to variables
function registerEvents(){
  // Open of sluit betaalmenu
  actieKnoppen.Betaling.addEventListener('click', openBetaalMenu, false);
  betaalKnoppen.annuleer.addEventListener('click', sluitBetaalMenu, false);

  // Verander naam
  veranderNaamKnop.addEventListener('click', openNaamMenu, false);
  naamSubmit.addEventListener('click', sluitNaamMenu,false);

  // Open of sluit startKoehandelScherm
  actieKnoppen.Koehandel.addEventListener('click', openStartKoehandelScherm, false);
  startKoehandel.annuleer.addEventListener('click', sluitStartKoehandelScherm, false);
  startKoehandel.uitgedaagde.addEventListener('change', veranderUitgedaagde, false);
}


// Add eventlisteners for the resizing of the game
window.addEventListener('load', resizeGame, false);
window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);
window.addEventListener('load', initializeVariables,false);
window.addEventListener('load', registerEvents, false);