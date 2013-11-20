Game = function (socket) {
  this.socket = socket;
  this.Pacman = require("./player");
};

Game.prototype.step = function () {
  this.pacman && this.pacman.step();
};

Game.prototype.animate = function () {
  var self = this;
  setInterval(function () {
    self.step();
  }, 100)
};

Game.prototype.handleKeyPress = function (keyCode) {
  this.pacman.turn(keyCode, this.inputProcessed.bind(this));
};

Game.prototype.inputProcessed = function () {
  this.socket.emit("inputProcessed", this.pacman);
};

Game.prototype.listenForInput = function () {
  var self = this;
  this.socket.on("keyPressed", function (data) {
    self.handleKeyPress(data.keyPressed);
  });
};

Game.prototype.start = function () {
  this.pacman = new this.Pacman(0, 0);
  this.animate();
  this.listenForInput();
};

module.exports = Game;