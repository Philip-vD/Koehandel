var socket = io();

socket.emit('new player');

// Log the messages from the server
socket.on('message', function(data){
  console.log(data);
});