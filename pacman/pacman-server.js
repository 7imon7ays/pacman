var _ = require("underscore");
Pacman = require("./player");

Game = function (pacmanSpeed, canvasDimensions) {
  this.playerCount = 0;
  this.pacmanSpeed = pacmanSpeed;
  this.plane = canvasDimensions;
  this.sockets = {};
  this.pacmen = {};
};

Game.prototype.start = function (socket) {
  this.addPlayer(socket);
  this.animate();
}

Game.prototype.addPlayer = function (socket) {
  this.playerCount++;
  this.sockets[socket.id] = socket;
  this.pacmen[socket.id] = new Pacman(socket.id, this.pacmanSpeed, this.plane);
  this.setParams(socket);
  this.listenForInput(socket);
  this.listenForExit(socket);
}

Game.prototype.setParams = function (socket) {
  var pacmenIDs = this._getPacmenIDs();
  socket.emit("setParams", { canvasSize: this.plane, pacmenIDs: pacmenIDs });
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
    self.handleKeyPress(data.keyPressed);
  });
};

Game.prototype.animate = function () {
  var self = this;
  setInterval(function () {
    self.step();
    _(self.sockets).each(function (socket) {
      socket.emit("update", self.pacmen);
    });
  }, 30)
};

Game.prototype.listenForExit = function (socket) {
  self = this;
  socket.on("disconnect", function () {
    console.log("player disconnected");
    delete self.sockets[socket.id];
  })
}

Game.prototype.step = function () {
  if (_(this.pacmen).isEmpty()) return;
  _(this.pacmen).each(function(pacman){ pacman.step(); });
};

Game.prototype.handleKeyPress = function (keyCode) {
  _(this.pacmen).each(function (pacman) {
    pacman.turn(keyCode);
  });
};

module.exports = Game;