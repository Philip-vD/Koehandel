//Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var Player = require('./Player.js');
var KoeHandel = require('./KoeHandel.js');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

//Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

var state = {
  gameStarted: false,
  modus: 'geen', //koehandel, stamboekhandel, rathandel
  ezelCount: 0,
  players: {},
};

var handelObject;

//const
var ezelToMoney = {
  0: 50,
  1: 100,
  2: 200,
  3: 500,
};

// Add the WebSocket handlers
io.on('connection', function(socket) {
  socket.on('new player', function() {
    state.players[socket.id] =
      new Player(Object.keys(state.players).length === 0);
  });

  socket.on('nameChange', function(data) {
    state.players[socket.id].name = data;
  });

  socket.on('startGame', function() {
    state.gameStarted = true;
  });

  socket.on('ezel', function() {
    if (state.ezelCount === 4) {
      io.sockets.emit('message', 'Het max aantal ezels is al bereikt.');
    }
    else {
      for (const player in state.players)
        player.addAmount(ezelToMoney[state.ezelCount]);
      state.ezelCount ++;
    }
  });

  socket.on('giveMoney', function(data) {
    state.players[socket.id].subtractMoney(data.money);
    state.palyers[data.recipient].addMoney(data.money);
  })

  socket.on('startKoehandel', function(data) {
    this.state.mode = 'koehandel';
    handelObject = new KoeHandel(socket.id, data.challengedId);
  })

  socket.on('abortHandel', function() {
    this.state.mode = 'geen';
    handelObject = null;
  })

  socket.on('submitKoehandel', function(data) {
    const result = handelObject.submit(socket.id, data);
    if (result) {
      io.sockets.emit('message', result);
      this.state.mode = 'geen';
      this.handelObject= null;
    }
  })
});

setInterval(function() {
  io.sockets.emit('state', state);
}, 1000 / 60);