var _ = require("underscore")
  , MovingObject = require("./moving-object-server")

function Pacman (id, gameSettings, color) {
  this.id = id;
  this.color = Pacman.Colors[color.color] || "000000";
  
  this.size = 10;
  this.buffer = this.size * 2;

  this.speed = gameSettings.pacmanSpeed;
  this.plane = gameSettings.plane;
  this.grid = gameSettings.grid;
  this.x = 20;
  this.y = 20;
  this.xDelta = this.speed;
  this.yDelta = 0;
};

MovingObject.bequeath(Pacman);

Pacman.Colors = {
  red: "FF0000",
  blue: "6E82F0",
  green: "5FDE81",
  yellow: "F0EA3A"
}

Pacman.prototype.turn = function (keyCode) {
  if (this._blockedInThatDirection(keyCode)) return;
  switch (keyCode) {
  case 38:
    this.yDelta = -(this.speed);
    this.xDelta = 0;
    break;
  case 40:
    this.yDelta = this.speed;
    this.xDelta = 0;
    break;
  case 37:
    this.yDelta = 0;
    this.xDelta = -(this.speed);
    break;
  case 39:
    this.yDelta = 0;
    this.xDelta = this.speed;
    break;
  }
}

Pacman.prototype._blockedInThatDirection = function (keyCode) {
  switch (keyCode) {
  case 38:
    if (this.checkForBlocks() === "top") return true;
    break;
  case 40:
    if (this.checkForBlocks() === "bottom") return true;
    break;
  case 37:
    if (this.checkForBlocks() === "left") return true;
    break;
  case 39:
    if (this.checkForBlocks() === "right") return true;
    break;
  }
}

module.exports = Pacman;
