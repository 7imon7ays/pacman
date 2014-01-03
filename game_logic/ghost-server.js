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

Ghost.prototype.step = function () {
  this.findDirection();
  this.x += this.xDelta;
  this.y += this.yDelta;
}

Ghost.prototype.findDirection = function () {
 var blockedDirection = this.checkForBlocks();

 if (blockedDirection) {
   this.takeDetour(blockedDirection);
 } else {
   this.heatSeak();
 }
}

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

Ghost.prototype.takeDetour = function (blockedDirection) {
  switch(blockedDirection) {
  case "right":
    this.xDelta = 0;
    this.yDelta = 2;
    break;
  case "left":
    this.xDelta = 0;
    this.yDelta = 2;
    break;
  case "top":
    this.xDelta = 2;
    this.yDelta = 0;
    break;
  case "bottom":
    this.xDelta = 2;
    this.yDelta = 0;
    break;
  }
}

module.exports = Ghost;
