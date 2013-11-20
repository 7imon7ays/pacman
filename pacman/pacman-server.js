Game = {};

Game.Pacman = require("./pacman")

Game.step = function () {
  this.pacman && this.pacman.step();
};

Game.animate = function () {
  var self = this;
  setInterval(function () {
    self.step();
  }, 100)
};

Game.handleKeyPress = function (keyCode) {
  this.pacman.turn(keyCode);
}

Game.start = function (socket) {
  this.pacman = new this.Pacman(0, 0);
  this.animate();
  socket.on("keyPressed", function (data) {
    Game.handleKeyPress(data.keyPressed);
    socket.emit("handledKeyPress", Game);
  });
};

module.exports = Game;