//Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var money = require('./util/money.js');
var Player = require('./Player.js');
var KoeHandel = require('./KoeHandel.js');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use(express.static(path.join(__dirname + '/static')));

//Routing
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function () {
  console.log('Starting server on port 5000');
});

var state = {
  gameStarted: false,
  modus: 'geen', //koehandel, stamboekhandel, rathandel
  ezelCount: 0,
  ratCount: 0,
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

//Routing
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Add the WebSocket handlers
io.on('connection', function (socket) {
  socket.on('new player', function () {
    state.players[socket.id] = new Player(
      Object.keys(state.players).length === 0,
    );
    io.sockets.emit('message', 'Er heeft zich een nieuwe speler aangemeld!');
  });

  socket.on('nameChange', function (data) {
    state.players[socket.id].name = data;
  });

  socket.on('startGame', function () {
    state.gameStarted = true;
  });

  socket.on('ezel', function () {
    if (state.ezelCount === 4) {
      io.sockets.emit('message', 'Het max aantal ezels is al bereikt.');
    } else {
      for (const player in state.players)
        money.addAmount(player.money, ezelToMoney[state.ezelCount]);
      state.ezelCount++;
    }
  });

  socket.on('giveMoney', function (data) {
    money.subtractMoney(state.players[socket.id].money, data.money);
    money.addMoney(state.palyers[data.recipient].money, data.money);
  });

  socket.on('startKoehandel', function (data) {
    state.mode = 'koehandel';
    handelObject = new KoeHandel(
      socket.id,
      data.challengedId,
      data.offer,
      data.rat,
    );
    money.subtractMoney(state.players[socket.id].money, data.offer);
    io.sockets.emit(
      'message',
      state.players[socket.id].name +
        'heeft ' +
        money.cardCount(data.offer) +
        'kaarten op tafel gelegd.',
    );
  });

  socket.on('abortHandel', function () {
    state.mode = 'geen';
    handelObject = null;
  });

  socket.on('acceptKoehandel', function (data) {
    addMoney(state.players[socket.id].money, handelObject.offer);
    handelObject = null;
    state.mode = 'geen';
  });

  socket.on('disconnect', function () {
    console.log('Player ' + socket.id + ' has disconnected.');
  });
});

setInterval(function () {
  io.sockets.emit('state', state);
}, 1000 / 60);
