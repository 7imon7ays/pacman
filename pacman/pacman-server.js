Pacman = require("./player");

Game = function (socket) {
  this.socket = socket;
};

Game.prototype.step = function () {
  this.pacman && this.pacman.step();
};

Game.prototype.animate = function () {
  var self = this;
  var pacmanState = this.pacman;
  setInterval(function () {
    self.step();
    self.socket.emit("update", pacmanState);
  }, 30)
};

Game.prototype.handleKeyPress = function (keyCode) {
  this.pacman.turn(keyCode);
};

Game.prototype.listenForInput = function () {
  var self = this;
  this.socket.on("keyPressed", function (data) {
    self.handleKeyPress(data.keyPressed);
  });
};

Game.prototype.setCanvasDimensions = function () {
  this.socket.emit("setCanvasDimensions", this.plane);
}

Game.prototype.start = function (pacmanSpeed, pacmanCoords, canvasDimensions) {
  this.pacman = new Pacman(pacmanSpeed, pacmanCoords.x, pacmanCoords.y);
  this.plane = canvasDimensions;
  this.setCanvasDimensions();
  this.animate();
  this.listenForInput();
};

module.exports = Game;