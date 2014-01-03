var _ = require("underscore")
  , Pacman = require("./pacman-server")
  , Ghost = require("./ghost-server");

function Game () {
  this.settings = {
    pacmanSpeed: 2,
    plane: { height: 300, width: 500 },
    grid: require("./grid-server")
  };
  this.playerCount = 0;
  this.sockets = {};
  this.pacmen = {};
  this.ghosts = {};
};

Game.prototype.start = function (socket, gameOptions) {
  this.addPlayer(socket, gameOptions);
  this.animate();
}

Game.prototype.addPlayer = function (socket, colorChoice) {
  var self = this;
  this.playerCount++;
  this.sockets[socket.id] = socket;
  this.pacmen[socket.id] = new Pacman(socket.id, this.settings, colorChoice);
  this.ghosts[socket.id] = new Ghost(socket.id, this.pacmen[socket.id], this.settings);
  _(this.sockets).each(function (socket) { self.setParams(socket); });
  this.listenForInput(socket);
  this.listenForExit(socket);
}

Game.prototype.setParams = function (socket) {
  var pacmenIDs = this._getPacmenIDs();
  socket.emit("setParams", { canvasSize: this.settings.plane, pacmenIDs: pacmenIDs, grid: this.settings.grid });
}

Game.prototype._getPacmenIDs = function () {
  IDs = [];
  _(this.pacmen).each(function (pacman) {
    IDs.push(pacman.id);
  });
  return IDs;
}

Game.prototype.listenForInput = function (socket) {
  var self = this;
  socket.on("keyPressed", function (data) {
    self.handleKeyPress(data.keyPressed, data.socketid);
  });
};

Game.prototype.animate = function () {
  var self = this;
  setInterval(function () {
    self.step();
    self.updateClients();
  }, 30)
}

Game.prototype.step = function () {
  if (_(this.pacmen).isEmpty()) return;
  _(this.pacmen).each(function(pacman){ pacman.step(); });
  _(this.ghosts).each(function (ghost) { 
    ghost.step();
  });
};

Game.prototype.updateClients = function () {
  var pacmenStates = this._createPacmenStates();
  var ghostStates = this._createGhostStates();
  var gameState = { pacmen: pacmenStates, ghosts: ghostStates };

  _(self.sockets).each(function (socket) {
    socket.emit("update", gameState);
  });
}

Game.prototype._createPacmenStates = function () {
  var pacmenStates = {};
  _(self.pacmen).each(function (pacman) {
    pacmenStates[pacman.id] = _(pacman).pick("id", "color", "x", "y", "xDelta", "yDelta", "size");
  });

  return pacmenStates;
}

Game.prototype._createGhostStates = function () {
  var ghostStates = {};
  _(self.ghosts).each(function (ghost) {
    ghostStates[ghost.id] = _(ghost).pick("id", "color", "x", "y", "xDelta", "yDelta", "size");
  });

  return ghostStates;
}

Game.prototype.handleKeyPress = function (keyCode, socketid) {
  this.pacmen[socketid].turn(keyCode);
};

Game.prototype.listenForExit = function (socket) {
  self = this;
  socket.on("disconnect", function () {
    console.log("\nPlayer disconnected.\n");
    var playerId = socket.id;
    delete self.sockets[playerId];
    delete self.pacmen[playerId];
    delete self.ghosts[playerId];
    self.announceExit(playerId);
  })
}

Game.prototype.announceExit = function (playerId) {
  _(this.sockets).each(function (socket) {
    socket.emit("playerDisconnected", playerId)
  })
}

module.exports = Game;