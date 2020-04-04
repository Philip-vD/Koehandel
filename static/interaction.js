
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

// Add eventlisteners for the resizing of the game
window.addEventListener('load', resizeGame, false);
window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);
