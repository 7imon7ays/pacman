var _ = require("underscore")
  , MovingObject = require("./moving-object-server");

function Ghost (id, pacman, gameSettings) {
  this.id = id;
  this.color = "000000"
  this.pacman = pacman;

  this.size = 10;
  this.buffer = this.size + 7;

  this.speed = gameSettings.pacmanSpeed;
  this.plane = gameSettings.plane;
  this.grid = gameSettings.grid;
  this.x = 100;
  this.y = 100;
  this.xDelta = this.speed;
  this.yDelta = 0;
}

MovingObject.bequeath(Ghost);

Ghost.prototype.heatSeak = function () {
  var horiDistance = Math.abs(this.pacman.x - this.x);
  var vertiDistance = Math.abs(this.pacman.y - this.y);

  if (horiDistance > vertiDistance) {
    this.xDelta = 2 * (horiDistance / (this.pacman.x - this.x));
    this.yDelta = 0;
  } else {
    this.yDelta = 2 * (vertiDistance / (this.pacman.y - this.y));
    this.xDelta = 0;
  }
};

Ghost.prototype.step = function () {
  if (!this.checkForBlocks()) {
    this.heatSeak();
    this.x += this.xDelta;
    this.y += this.yDelta;
  } else {
    console.log("\nGhost blocked!\n");
  }
};

module.exports = Ghost;